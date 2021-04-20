<?php

namespace App\Http\Controllers\admin\droplet;

use App\Models\Server;
use App\Models\Project;
use App\Models\Storage;
use App\Models\Invoices;
use App\Models\AdminUsers;
use Illuminate\Support\Str;
use App\Models\InvoiceItems;
use Illuminate\Http\Request;
use App\Models\StorageChanges;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Http\Controllers\helpers\CommonFunctions as CF;

class InvoiceController extends Controller
{

    public function invoices(Request $request)
    {
        $user = AdminUsers::find(auth()->user()->id);
        $withTrashed = ($request->trashed === 1) ? true : false;
        $sort = CommonFunctions::checkQueryString($request);
        $in = $request->input();
        $id = ($request->id !== null) ? $request->id : null;
        error_log(json_encode($sort));
        // sleep(5);
        if ($user->can('droplets.invoices.view')) {
            $data = Invoices::join('users', 'users.id', '=', 'invoices.user_id')
                ->select([
                    'users.name as username',
                    'invoices.*',
                    DB::raw('count(*) as invoices')
                ]);
            if ($id) {
                $data->where("invoices.user_id", $id);
            }
            if ($in['filter'] !== null) {
                if (isset($in['filter']['user'])) {
                    $data->whereHas('user', function ($q) use ($in) {
                        if ($in['filter']['user'] !== '') {
                            $q->where('name', 'LIKE', '%' . $in['filter']['user'] . '%');
                        }
                    });
                } else {
                    $data->where(function ($q) use ($in) {
                        foreach ($in['filter'] as $column => $value) {
                            if ($value !== null || $value !== '') {
                                $q = $q->where($column, 'LIKE', '%' . $value . '%');
                            }
                        }
                    });
                }
            }
            if ($withTrashed) {
                $data->onlyTrashed();
            }
            $data->sum('grand_total');
            // $data->select('invoices.month_year', DB::raw('count(*) as invoices'));
            $data->groupBy('invoices.month_year');
            $data = $data->orderBy($sort->column, $sort->asc)
                ->paginate($sort->perPage);

            return CommonFunctions::sendResponse(1, "Access Granted", $data);
        } else {
            return CommonFunctions::sendResponse(0, "Permission Denied", null);
        }
    }

    public function generateInvoice($invoiceDate)
    {
        $projects = Project::withTrashed()->get();
        // $invoiceDate = "2021-03";
        $charge = [];
        $month = date('m', strtotime($invoiceDate));
        foreach ($projects as $project) {
            $tC = 0;
            $s = 0;
            $array = [];
            $invoices = [];
            $items = [];
            $invoices['user_id'] = $project->user_id;
            $invoices['project_id'] = $project->id;
            $invoices['month_year'] = date('M, Y', strtotime($invoiceDate));
            $invoices['month'] = date('Y-m', strtotime($invoiceDate));
            $invoices['amount'] = 0;
            $invoices['status'] = 'unpaid';
            $invoices['payment_date'] = null;

            // Get Servers
            $servers = Server::where([['user_id', $project->user_id], ['project_id', $project->id]])->withTrashed()->get();
            foreach ($servers as $server) {
                $getCost = $this->getServerCost($server, $invoiceDate);
                $tC += ($getCost) ? $getCost['totalCharge'] : 0;
                if ($getCost) {
                    $array[$s] = $getCost;
                    $items[$s]['item'] = $getCost['name'];
                    $items[$s]['days'] = $getCost['totalDays'];
                    $items[$s]['hours'] = $getCost['totalHours'];
                    $items[$s]['i:s'] = $getCost['i:s'];
                    $items[$s]['total'] = $getCost['serverCharge'];
                    $items[$s]['cost_type'] = $getCost['chargeType'];
                    $items[$s]['rate'] = $getCost['rate'];
                    $items[$s]['description'] = $getCost['description'];

                    //Storage
                    if ($getCost['blockStorage'] && count($getCost['blockStorage']['changes']) > 0) {
                        foreach ($getCost['blockStorage']['changes'] as $changes) {
                            if ($changes['charge'] > 0) {
                                $s++;
                                $items[($s)]['item'] = $changes['name'];
                                $items[($s)]['days'] = $changes['days'];
                                $items[($s)]['hours'] = $changes['hours'];
                                $items[($s)]['i:s'] = $changes['i:s'];
                                $items[($s)]['total'] = $changes['charge'];
                                $items[($s)]['cost_type'] = $changes['chargeType'];
                                $items[($s)]['rate'] = $changes['rate'];
                                $items[($s)]['description'] = $changes['description'];
                            }
                        }
                    }
                    $s++;
                }
            }

            // Total cost
            $invoices['amount'] = $tC;
            $charge[] = ['invoice' => $invoices, 'items' => $items, 'server' => $array];
        }
        $this->saveOrUpdateInvoice($charge);
        return $charge;
    }
    public function saveOrUpdateInvoice($data)
    {
        foreach ($data as $invoice) {
            if (count($invoice['items']) > 0) {
                if ($invoice['invoice']['amount'] > 0) {
                    if (Invoices::where([
                        ['user_id', $invoice['invoice']['user_id']],
                        ['project_id', $invoice['invoice']['project_id']],
                        ['month_year', $invoice['invoice']['month_year']]
                    ])->exists()) {
                        $this->updateInvoice($invoice);
                    } else {
                        $this->saveInvoice($invoice);
                    }
                }
            }
        }
        return true;
    }
    public function saveInvoice($invoice)
    {
        $invoices = new Invoices();
        $invoices->uuid =  Str::uuid();
        $invoices->user_id = $invoice['invoice']['user_id'];
        $invoices->project_id = $invoice['invoice']['project_id'];
        $invoices->month_year = $invoice['invoice']['month_year'];
        $invoices->amount = $invoice['invoice']['amount'];
        $invoices->status = $invoice['invoice']['status'];
        $invoices->payment_date = $invoice['invoice']['payment_date'];
        $invoices->hours = 0;
        $invoices->days = 0;
        $invoices->hourly_rate = 0;
        $invoices->discount = null;
        $previousArrears = CF::previousArrears($invoice['invoice']['month'], $invoice['invoice']['project_id'], $invoice['invoice']['user_id']);
        $invoices->previous_arrears = ($previousArrears == 0) ? null : $previousArrears;
        $taxEnabled = CF::isTaxEnabled();

        if ($taxEnabled['status']) {
            $invoices->tax_percent = $taxEnabled['tax'];
            $invoices->tax_amount = round($invoice['invoice']['amount'] * $taxEnabled['tax'] / 100, 2);
            $invoices->total_with_tax = round($invoice['invoice']['amount'] + $taxEnabled['tax'] / 100, 2);
            $invoices->grand_total = round(($invoice['invoice']['amount'] + $taxEnabled['tax'] / 100) + $previousArrears, 2);
        } else {
            $invoices->grand_total = $invoice['invoice']['amount'] + $previousArrears;
        }
        $invoices->save();
        $invoiceId = $invoices->id;
        foreach ($invoice['items'] as $items) {
            $item = new InvoiceItems();
            $item->invoice_id = $invoiceId;
            $item->item = $items['item'];
            $item->description = $items['description'];
            $item->cost_type = $items['cost_type'];
            $item->total = $items['total'];
            $item->days = $items['days'];
            $item->hours = $items['hours'];
            $item->hourly_rate = $items['rate'];
            $item->currency = 'USD';
            $item->save();
        }
    }
    public function updateInvoice($invoice)
    {
        $invoices = Invoices::where([
            ['user_id', $invoice['invoice']['user_id']],
            ['project_id', $invoice['invoice']['project_id']],
            ['month_year', $invoice['invoice']['month_year']]
        ])->first();
        $invoices->amount = $invoice['invoice']['amount'];
        $invoices->status = $invoice['invoice']['status'];
        $invoices->payment_date = $invoice['invoice']['payment_date'];
        $invoices->hours = 0;
        $invoices->days = 0;
        $invoices->hourly_rate = 0;
        $invoices->discount = null;
        $previousArrears = CF::previousArrears($invoice['invoice']['month'], $invoice['invoice']['project_id'], $invoice['invoice']['user_id']);
        $invoices->previous_arrears = ($previousArrears == 0) ? null : $previousArrears;
        $taxEnabled = CF::isTaxEnabled();
        if ($taxEnabled['status']) {
            $invoices->tax_percent = $taxEnabled['tax'];
            $invoices->tax_amount = round($invoice['invoice']['amount'] * $taxEnabled['tax'] / 100, 2);
            $invoices->total_with_tax = round($invoice['invoice']['amount'] + $taxEnabled['tax'] / 100, 2);
            $invoices->grand_total = round(($invoice['invoice']['amount'] + $taxEnabled['tax'] / 100) + $previousArrears, 2);
        } else {
            $invoices->tax_percent = null;
            $invoices->tax_amount = null;
            $invoices->total_with_tax = null;
            $invoices->grand_total = $invoice['invoice']['amount'] + $previousArrears;
        }
        $invoices->save();
        $invoiceId = $invoices->id;
        InvoiceItems::where('invoice_id', $invoiceId)->forceDelete();
        foreach ($invoice['items'] as $items) {
            $item = new InvoiceItems();
            $item->invoice_id = $invoiceId;
            $item->item = $items['item'];
            $item->description = $items['description'];
            $item->cost_type = $items['cost_type'];
            $item->total = $items['total'];
            $item->days = $items['days'];
            $item->hours = $items['hours'];
            $item->hourly_rate = $items['rate'];
            $item->currency = 'USD';
            $item->save();
        }
    }
    public function getServerCost($server, $date, $tillDate = false)
    {
        // Calculate charge of the given month
        $totalCharges = 0;
        $_rate = 0;
        $lastDate = (!$tillDate) ? date('Y-m-t 23:59:59', strtotime($date)) : date('Y-m-d h:i:s', strtotime($date));
        $firstDate = date('Y-m-01', strtotime($date));
        $totalDays = (int) date('t', strtotime($date));
        $totalHours = $totalDays * 24;
        $his = null;
        $thisMonthYear = date('Y-m', strtotime($date));
        $createdAt = $server->created_at;
        $createAtDate = date('d', strtotime($createdAt));
        $isDeleted = $server->trashed();
        $deletedAt = $server->deleted_at;
        $deletedAtDate =  ($deletedAt !== null) ? date('d', strtotime($deletedAt)) : null;
        $createdMonthYear = date('Y-m', strtotime($createdAt));
        $deletedMonthYear = date('Y-m', strtotime($deletedAt));
        $maxHours = (date('m', strtotime($lastDate)) == 02) ? 671.97 : 719.97;
        $chargeType = null;
        $serverCharge = null;
        if ($isDeleted && $deletedMonthYear !== $thisMonthYear) {
            return null;
        }
        if (strtotime($createdAt) > strtotime($lastDate)) {
            return null;
        }

        if ($createdMonthYear == $thisMonthYear) {
            $totalDays = ($totalDays - $createAtDate) + 1;
            if ($isDeleted) {
                $totalDays = ($deletedAtDate - $createAtDate) + 1;
                $lastDate = $deletedAt;
            }
            $totalHours = CF::getDiff(strtotime($createdAt), strtotime($lastDate), 'hours');
            $his = CF::getDiff(strtotime($createdAt), strtotime($lastDate), 'i:s');
        } else {
            // $totalDays = ($totalDays - 1) + 1;
            if ($isDeleted) {
                $totalDays = $deletedAtDate;
                $lastDate = $deletedAt;
            }
            $totalHours = CF::getDiff(strtotime($firstDate), strtotime($lastDate), 'hours');
            $his = CF::getDiff(strtotime($firstDate), strtotime($lastDate), 'i:s');
        }
        //$storageChargeHourly = 0.000138;
        $blockStorage = Storage::where('server_id', $server->id)->withTrashed();


        $rate = CF::getSizeDetails($server->size);
        if ($rate) {
            if ($totalHours > $maxHours) {
                $chargeType = 'monthly';
                $serverCharge = round($rate->parvaty_price_monthly, 4);
                $_rate = $rate->parvaty_price_monthly;
            } else {
                $chargeType = 'hourly';
                $serverCharge = round($rate->parvaty_price_hourly * $totalHours, 4);
                $_rate = $rate->parvaty_price_hourly;
            }
        } else {
            $sizes = CF::makeRequest("/sizes", "GET");
            if ($sizes['status']) {
                $sizes = json_decode($sizes['data'])->sizes;
                $item = null;
                foreach ($sizes as $struct) {
                    if ($server->size == $struct->slug) {
                        $item = $struct;
                        break;
                    }
                }
            }
            if ($totalHours > $maxHours) {
                $chargeType = 'monthly';
                $serverCharge = round(($item->price_monthly * 2), 4);
                $_rate = $item->price_monthly * 2;
            } else {
                $chargeType = 'hourly';
                $serverCharge = round(($item->price_hourly * 2) * $totalHours, 4);
                $_rate = $item->price_hourly * 2;
            }
        }

        if ($blockStorage->exists()) {
            $blockStorage = $this->getStorageCost($blockStorage->first(), $lastDate, $tillDate);
            $totalCharges = $serverCharge + $blockStorage['totalCharge'];
        } else {
            $blockStorage = null;
            $totalCharges = $serverCharge;
        }

        $return = [
            'invoiceMonth' => $thisMonthYear,
            'id' => $server->id,
            'name' => "Server: " . $server->name,
            'createdAt' => $createdAt,
            'isDeleted' => $isDeleted,
            'deletedAt' => $deletedAt,
            'totalDays' => $totalDays,
            'totalHours' => $totalHours,
            'i:s' => $his,
            'serverCharge' => $serverCharge,
            'totalCharge' => $totalCharges,
            'chargeType' => $chargeType,
            'rate' => $_rate,
            'description' => $_rate,
            'blockStorage' => $blockStorage
        ];
        return $return;
    }
    public function getStorageCost($storage, $lastDate, $tillDate = false)
    {
        $totalCharges = 0;
        $totalDays = (int) (!$tillDate) ? date('t', strtotime($lastDate)) : date('d', strtotime($lastDate));
        $totalHours = $totalDays * 24;
        $is = null;
        $thisMonthYear = date('Y-m', strtotime($lastDate));
        $createdAt = $storage->created_at;
        $createAtDate = date('d', strtotime($createdAt));
        $isDeleted = $storage->trashed();
        $deletedAt = $storage->deleted_at;
        $deletedAtDate =  ($deletedAt !== null) ? date('d', strtotime($deletedAt)) : null;
        $createdMonthYear = date('Y-m', strtotime($createdAt));
        //$deletedMonthYear = date('Y-m', strtotime($deletedAt));
        $chargeType = null;

        if ($createdMonthYear == $thisMonthYear) {
            $totalDays = ($totalDays - $createAtDate) + 1;
            if ($isDeleted) {
                $totalDays = ($deletedAtDate - $createAtDate) + 1;
                $lastDate = $deletedAt;
            }
            $totalHours = CF::getDiff(strtotime($createdAt), strtotime($lastDate), 'hours');
            $is = CF::getDiff(strtotime($createdAt), strtotime($lastDate), 'i:s');
        }
        $changes = StorageChanges::where('storage_id', $storage->id)->get();

        foreach ($changes as $key => $change) {
            if (isset($changes[$key + 1])) {
                $chrg = $this->calculateCost($change, $changes[$key + 1], $lastDate);
                $changes[$key] = $chrg;
                $chargeType = $chrg['chargeType'];
                $totalCharges += $chrg['charge'];
            } else {
                $chrg = $this->calculateCost($change, null, $lastDate);
                $changes[$key] = $chrg;
                $totalCharges += $chrg['charge'];
                $chargeType = $chrg['chargeType'];
            }
        }
        $return = [
            'invoiceMonth' => $thisMonthYear,
            'id' => $storage->id,
            'name' => "Storage: " . $storage->size . "GB",
            'createdAt' => $createdAt,
            'lastDate' => $lastDate,
            'isDeleted' => $isDeleted,
            'deletedAt' => $deletedAt,
            'totalDays' => $totalDays,
            'totalHours' => $totalHours,
            'i:s' => $is,
            'chargeType' => $chargeType,
            'totalCharge' => round($totalCharges, 4),
            'changes' => $changes,
        ];
        return $return;
    }
    public function calculateCost($started, $ended, $lastDate)
    {
        $hourlyRate = 0.000138 * 2;
        $monthlyRate = 0.10 * 2;
        $rate = 0;
        $chargeType = null;
        $charge = 0;
        $hours = null;
        $his = null;
        $start = $started->created_at;
        $end = ($ended) ? $ended->created_at : null;
        $size = (int) $started->size;
        $thisMonthYear = date('Y-m', strtotime($lastDate));
        $startMonthYear = date('Y-m', strtotime($start));
        $endMonthYear = date('Y-m', strtotime($end));
        $maxHours = (date('m', strtotime($lastDate)) == 02) ? 671.97 : 719.97;

        // for start == this month
        if ($thisMonthYear == $startMonthYear) {
            if ($end) {
                $hours = CF::getDiff(strtotime($start), strtotime($end), 'hours');
                $his = CF::getDiff(strtotime($start), strtotime($end), 'i:s');
            } else {
                $end = $lastDate;
                $hours = CF::getDiff(strtotime($start), strtotime($lastDate), 'hours');
                $his = CF::getDiff(strtotime($start), strtotime($lastDate), 'i:s');
            }
        } else {
            if (!$end) {
                if (strtotime($start) <= strtotime($lastDate)) {
                    $start = date('Y-m-01 00:00:00', strtotime($lastDate));
                    $end = $lastDate;
                    $hours = CF::getDiff(strtotime($start), strtotime($end), 'hours');
                    $his = CF::getDiff(strtotime($start), strtotime($end), 'i:s');
                }
            }
        }
        // for end == this month
        if ($endMonthYear == $thisMonthYear) {
            $start = date('Y-m-01 00:00:00', strtotime($lastDate));
            $hours = CF::getDiff(strtotime($start), strtotime($end), 'hours');
            $his = CF::getDiff(strtotime($start), strtotime($end), 'i:s');
        }
        // end is bigger then last day
        if (strtotime($end) > strtotime($lastDate)) {
            $end = $lastDate;
            $hours = CF::getDiff(strtotime($start), strtotime($end), 'hours');
            $his = CF::getDiff(strtotime($start), strtotime($end), 'i:s');
        }
        // end is null
        if (!$end) {
            if (strtotime($start) <= strtotime($end)) {
                $end = $lastDate;
                $hours = CF::getDiff(strtotime($start), strtotime($end), 'hours');
                $his = CF::getDiff(strtotime($start), strtotime($end), 'i:s');
            }
        }
        // is monthly?
        if ($hours > $maxHours) {
            $chargeType = 'monthly';
            $rate = $monthlyRate;
            $charge = round($monthlyRate * $size, 4);
        } else {
            $chargeType = 'hourly';
            $rate = $hourlyRate;
            $charge = round($hourlyRate * $size * $hours, 4);
        }
        // return
        return [
            'id' => $started->id,
            'size' => $size,
            'name' => "Storage: " . $size . "GB",
            'hours' => $hours,
            'days' => round($hours / 24),
            'i:s' => $his,
            'start' => $start,
            'end' => $end,
            'description' =>  $rate . '/GB',
            'chargeType' => $chargeType,
            'charge' => $charge,
            'rate' => $rate,
        ];
    }
}
