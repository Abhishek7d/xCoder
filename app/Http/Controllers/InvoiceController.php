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
use App\Models\SavedCards;
use App\Models\Transactions;

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
        array_push($details['invoicedTo'], ...$this->getAddress($user));
        $details['payTo'] =  [
            'Parvaty Cloud Hosting',
        ];
        array_push($details['payTo'], ...$this->getAddress());
        $details['items'] =  $invoiceItems;
        return CF::sendResponse(1, "Details", $details);
    }
    public function getAddress($user = 'parvaty')
    {
        if ($user == 'parvaty') {
            return [
                'ForeShop Inc'
            ];
        } else {
            $card = SavedCards::where('user_id', $user->id)->first();
            return [
                $card->address,
                $card->city,
                $card->state,
                $card->country . ' ' . $card->postal_code
            ];
        }
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

    public function addCreditCard(Request $request)
    {
        if ($request->name !== 'null' && $request->id !== 'null'  && $request->number !== 'null' && $request->month !== 'null' && $request->year !== 'null' && $request->cvv !== 'null' && $request->address !== 'null' && $request->city !== 'null'  && $request->state !== 'null' && $request->country !== 'null' && $request->postal) {
            $terminal = config('app.cardcom_terminal', 1000);
            $username = config('app.cardcom_username', 'barak9611');

            $url = "https://secure.cardcom.co.il/Interface/Direct2.aspx?TerminalNumber=$terminal&Sum=1&cardnumber=$request->number&cardvalidityyear=$request->year&cardvaliditymonth=$request->month&identitynumber=$request->id&username=$username&Languages=en&Cvv=$request->cvv&CreateToken=true&CoinISOName=USD";
            //&Jparameter=2&CreateToken=true
            $result = CF::sendRequest(null, $url);

            error_log(json_encode($request->input()));
            error_log(json_encode($result));

            if ($result['ResponseCode'] == "501" || $result['ResponseCode'] == "505" || $result['ResponseCode'] == "614") {
                return CF::sendResponse(0, 'Internal Server Error');
            }
            if ($result['ResponseCode'] == "0") {
                $isAdded = SavedCards::where([['token', $result['Token']], ['user_id', auth()->user()->id]])->exists();
                if (!$isAdded) {
                    $card = new SavedCards();
                    $card->user_id = auth()->user()->id;
                    $card->name = $request->name;
                    $card->card_holder_id = $request->id;
                    $card->number = $result['CardNumEnd'];
                    $card->card = $request->card;
                    $card->month = $request->month;
                    $card->year = $request->year;
                    $card->cvv = $request->cvv;
                    $card->token = $result['Token'];
                    $card->city = $request->city;
                    $card->state = $request->state;
                    $card->address = $request->address;
                    $card->country = $request->country;
                    $card->postal_code = $request->postal;
                    $card->primary = (SavedCards::where('user_id', auth()->user()->id)->exists()) ? 0 : 1;
                    $card->save();

                    $transaction = new Transactions();
                    $transaction->amount = "1";
                    $transaction->currency = "USD";
                    $transaction->user_id = auth()->user()->id;
                    $transaction->card = $result['CardNumEnd'];
                    $transaction->low_profile_code = (isset($result['LowProfileCode'])) ? $result['LowProfileCode'] : 'N/A';
                    $transaction->description = $result['Description'];
                    $transaction->internal_deal_number = $result['InternalDealNumber'];
                    $transaction->approval_number = $result['ApprovalNumber'];
                    $transaction->status = 'success';
                    $transaction->save();

                    return CF::sendResponse(1, 'Card added successful', $result);
                } else {
                    return CF::sendResponse(0, 'Card already exists', $result);
                }
            } else {
                return CF::sendResponse(0, $result['Description']);
            }
        } else {
            return CF::sendResponse(0, 'All fields are required');
        }
    }

    public function getCreditCard()
    {
        $cards = SavedCards::select(['name', 'id', 'card_holder_id', 'number', 'month', 'year', 'address', 'city', 'state', 'country', 'postal_code', 'card', 'primary'])->where('user_id', auth()->user()->id)->get();
        return CF::sendResponse(1, 'All cards', $cards);
    }

    public function getTransactions()
    {
        $transactions = Transactions::where('user_id', auth()->user()->id)->paginate(15);
        return CF::sendResponse(1, 'All Transactions', $transactions);
    }
    public function creditCardAction(Request $request)
    {
        $id = $request->id;
        $action = $request->action;
        $status = 0;
        $msg = "Error";
        switch ($action) {
            case 'make-primary':
                SavedCards::where('primary', 1)->update(['primary' => 0]);
                $card = SavedCards::where('id', $id)->first();
                $card->primary = 1;
                $card->save();
                $status = 1;
                $msg = "Card Marked Primary";
                break;
            case 'delete':
                $card = SavedCards::where('id', $id)->first();
                $card->delete();
                $status = 1;
                $msg = "Card Deleted Successful";
                break;
            default:
                null;
        }

        return CF::sendResponse($status, $msg);
    }
}
