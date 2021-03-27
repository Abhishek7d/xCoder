<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Server;
use App\Models\Project;
use App\Models\Storage;
use App\Models\Invoices;
use Illuminate\Support\Str;
use App\Models\InvoiceItems;
use Illuminate\Http\Request;
use App\Models\StorageChanges;
use App\Http\Controllers\helpers\CommonFunctions as CF;

class InvoiceController extends Controller
{
    public function getInvoiceDetails(Request $request, $id)
    {
        $user = auth()->user();
        $projectId = $request->project_id;
        $invoiceId = $id;
        $details = [];

        if (!$projectId || !$invoiceId) {
            return CF::sendResponse(0, "Invalid Invoice", $request->input());
        }
        $projectId = CF::projectId($projectId);
        $invoice = Invoices::where([['uuid', $invoiceId], ['project_id', $projectId], ['user_id', $user->id]]);
        if (!$invoice->exists()) {
            return CF::sendResponse(0, "Invalid Invoice", $request->input());
        }
        $invoiceItems = InvoiceItems::where('invoice_id', $invoice->first()->id)->get();
        $details['total'] =  $invoice->first()->amount;
        $details['taxPercent'] =  $invoice->first()->tax_percent;
        $details['taxAmount'] =  $invoice->first()->tax_amount;
        $details['totalWithTax'] =  $invoice->first()->total_with_tax;
        $details['previousArrears'] =  $invoice->first()->previous_arrears;
        $details['grandTotal'] =  $invoice->first()->grand_total;

        $details['status'] =  $invoice->first()->status;
        $details['paymentDate'] =  $invoice->first()->payment_date;
        $details['dueDate'] =  date('M d, Y', strtotime($invoice->first()->created_at . " + 5 days"));
        $details['invoiceDate'] =  date('M d, Y', strtotime($invoice->first()->created_at));
        $details['invoiceMonth'] =  date('M, Y', strtotime($invoice->first()->month_year));
        $details['userMail'] = $user->email;
        $details['salesMail'] = "sales@parvaty.me";
        $details['invoicedTo'] =  [
            $user->name,
        ];
        array_push($details['invoicedTo'], ...$this->getAddress());
        $details['payTo'] =  [
            'Parvaty Cloud Hosting',
        ];
        array_push($details['payTo'], ...$this->getAddress());
        $details['items'] =  $invoiceItems;
        return CF::sendResponse(1, "Details", $details);
    }
    public function getAddress()
    {
        return [
            'Your Address', 'Will be Displayed Here'
        ];
    }
    public function getStatistics(Request $request)
    {
        $stats = null;
        $user = auth()->user()->id;
        $year = ($request->year) ? $request->year : date('Y');
        $projectId = CF::projectId($request->project_id);
        if ($projectId == 0) {
            return CF::sendResponse(0, "Invalid Project", $request->input());
        }
        $stats = Self::getBillingDetails($user, $projectId, $year);
        return CF::sendResponse(1, "Stats", $stats);
    }

    public static function getBillingDetails($user_id, $project_id, $year)
    {
        $stats = [];
        // 
        $servers = Server::where([['user_id', $user_id], ['project_id', $project_id]])->select(['id', 'name', 'size', 'created_at']);
        if ($servers->exists()) {
            $servers = $servers->orderBy('created_at', 'desc')->withTrashed()->get();
            $created_at = $servers[($servers->count() - 1)]->created_at;
            $invoice = Invoices::where([['status', 'paid'], ['project_id', $project_id], ['user_id', $user_id]])->orderBy('payment_date', 'desc')->first();

            $totalHours = 0;
            // Stats
            $stats['stats'] = [
                'tillDate' => CF::getCostTillDate($servers),
                'estimated' => CF::getEstimated($servers),
                'lastPayment' => $invoice
            ];
            // Stats
            $stats['stats']['totalHours'] = round($totalHours, 2);
            // Invoices
            $stats['invoices'] = [
                'from' => $created_at,
                'from_formatted' => CF::formatTimestamp($created_at),
                'months' => CF::generateDates($created_at, Carbon::now(), $year, $project_id)
            ];
        } else {
            $stats = null;
        }
        return $stats;
    }
}
