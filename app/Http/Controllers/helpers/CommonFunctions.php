<?php

namespace App\Http\Controllers\helpers;

use DateTime;
use DatePeriod;
use DateInterval;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Project;
use phpseclib\Net\SSH2;
use phpseclib\Crypt\RSA;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Notifications;
use App\Models\DelegateAccess;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\InvoiceController;
use App\Models\Invoices;
use App\Models\ServerSize;
use Illuminate\Notifications\Notification;

class CommonFunctions extends Controller
{
    public static $availableSizes = ["s-1vcpu-1gb", "512mb", "s-1vcpu-2gb", "1gb", "s-3vcpu-1gb", "s-2vcpu-2gb", "s-1vcpu-3gb", "s-2vcpu-4gb", "2gb", "s-4vcpu-8gb", "m-1vcpu-8gb", "c-2", "4gb", "c2-2vcpu-4gb", "g-2vcpu-8gb", "gd-2vcpu-8gb", "m-16gb", "s-8vcpu-16gb", "s-6vcpu-16gb", "c-4", "8gb", "c2-4vpcu-8gb", "m-2vcpu-16gb", "m3-2vcpu-16gb", "g-4vcpu-16gb", "gd-4vcpu-16gb", "m6-2vcpu-16gb", "m-32gb", "s-8vcpu-32gb", "c-8", "c2-8vpcu-16gb", "m-4vcpu-32gb", "m3-4vcpu-32gb", "g-8vcpu-32gb", "s-12vcpu-48gb", "gd-8vcpu-32gb", "m6-4vcpu-32gb", "m-64gb", "s-16vcpu-64gb", "c-16", "32gb", "c2-16vcpu-32gb", "m-8vcpu-64gb", "m3-8vcpu-64gb", "g-16vcpu-64gb", "s-20vcpu-96gb", "48gb", "gd-16vcpu-64gb", "m6-8vcpu-64gb", "m-128gb", "s-24vcpu-128gb", "c-32", "64gb", "c2-32vpcu-64gb", "s-32vcpu-192gb"];
    public static $server_statuses = ['BLANK', "NOT READY", 'INSTALLING', "READY", "FAILD"];
    public static $application_statuses = ['BLANK', 'INSTALLING', "READY", "FAILD"];
    public static function releaseResponse($status = 0, $message = "", $data = null)
    {
        ignore_user_abort(true);
        set_time_limit(0);
        ob_start();
        echo json_encode(array('status' => $status, 'message' => $message, 'data' => $data));
        header('Content-Type: application/json');
        header('Connection: close');
        header('Content-Length: ' . ob_get_length());
        ob_end_flush();
        ob_flush();
        flush();
    }
    public static function connect($ip_address)
    {
        $key = new RSA();
        $key->loadKey(file_get_contents('../ssh-keys/parvaty-cloud-hosting'));
        $ssh = new SSH2($ip_address);
        if (!$ssh->login('root', $key)) {
            return false;
        }
        return $ssh;
    }
    public static function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    public static function sendResponse($status = 0, $message = "", $data = null)
    {
        $data = json_encode(array('status' => $status, 'message' => $message, 'data' => $data));
        return response($data)->header('Content-Type', 'application/json');
    }
    public static function validateSize($size)
    {
        if (($key = array_search($size, CommonFunctions::$availableSizes)) !== false) {
            return true;
        } else {
            return false;
        }
    }
    public static function makeRequest($url, $type = "GET", $body = null, $headers = null)
    {
        $curl_options = array(
            CURLOPT_URL => env("DO_API_ENDPOINT") . $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $type,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "Authorization: Bearer " . env('DO_API_TOKEN'),
            ),
        );
        if ($body != null) {
            $curl_options[CURLOPT_POSTFIELDS] = $body;
        }
        if ($headers != null) {
            if (is_array($headers)) {
                foreach ($headers as $header) {
                    array_push($curl_options[CURLOPT_HTTPHEADER], $header);
                }
            } else {
                array_push($curl_options[CURLOPT_HTTPHEADER], $headers);
            }
        }
        $curl = curl_init();
        curl_setopt_array($curl, $curl_options);
        $response = curl_exec($curl);
        $status = true;
        if (!$response) {
            $response = curl_error($curl);
            $status = false;
        }
        curl_close($curl);
        return ['status' => $status, 'data' => $response];
    }

    public static function notifyUser($user, $notification)
    {
        $noti = new Notifications();
        $noti->user_id = $user;
        $noti->msg = $notification;
        $noti->status = 'new';
        $noti->save();
    }

    public static function userHasDelegateAccess($project_uuid)
    {
        $user = auth()->user();
        $project_id = CommonFunctions::getId($project_uuid, 'projects');
        $dA = DelegateAccess::where([['status', 'active'], ['_delegate_user_id', auth()->user()->id], ['project_id', $project_id]]);
        $dA2 = DelegateAccess::where([['_delegate_user_id', auth()->user()->id], ['project_id', $project_id]]);

        $user->delegateAccess = (isset($dA2->first()->status)) ? $dA2->first()->status : 'active';
        if ($dA->exists()) {
            $dA->update([
                "last_active" => \Carbon\Carbon::now()
            ]);
            $project = Project::where([['user_id', $dA->first()->user_id], ['id', $project_id]]);
            if ($project->exists()) {
                $user = User::find($dA->first()->user_id);
                $user->delegateAccess = true;
            }
        }
        return $user;
    }
    public static function getId($uuid, $table)
    {
        if ($uuid) {
            $tbl = DB::table($table)->where('uuid', $uuid);
            if ($tbl->exists()) {
                return $tbl->first()->id;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    public static function projectId($uuid)
    {
        if ($uuid) {
            $tbl = DB::table('projects')->where('uuid', $uuid);
            if ($tbl->exists()) {
                return $tbl->first()->id;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    public static function serverId($uuid)
    {
        if ($uuid) {
            $tbl = DB::table('servers')->where('uuid', $uuid);
            if ($tbl->exists()) {
                return $tbl->first()->id;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    public static function invoiceId($uuid)
    {
        if ($uuid) {
            $tbl = DB::table('invoices')->where('uuid', $uuid);
            if ($tbl->exists()) {
                return $tbl->first()->id;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    public static function reverse_string($string)
    {
        $str = str_split($string);
        $str = array_reverse($str);
        return join('', $str);
    }
    public static function checkDeleteCode($codeOld, $deleteCode)
    {
        $codes = explode('-', $codeOld);
        $code = $codes[1];
        $code = Self::reverse_string($code);
        if (Self::getDiff($code, time()) > 10) {
            return false;
        }
        if ($codeOld == $deleteCode) {
            return true;
        }
    }

    public static function getDiff($time, $time1, $format = "minutes")
    {
        $datetime1 = new \DateTime("@$time"); //start time
        $datetime2 = new \DateTime("@$time1"); //end time
        $interval = $datetime1->diff($datetime2);
        $minutes = $interval->days * 24 * 60;
        $minutes += $interval->h * 60;
        $minutes += $interval->i;
        if ($format == "hours") {
            $minutes = round($minutes / 60, 2);
        }
        if ($format == "i:s") {
            $minutes =  $interval->i . 'm ' . $interval->s . 's';
        }
        return $minutes;
    }
    public static function makeUuid($prefix, $name)
    {
        return (string) Str::slug($prefix . ' ' . strtolower($name) . ' ' . Str::uuid(), '-');
    }
    public static function formatTimestamp($time)
    {
        return (new Carbon($time))->format('M d, Y - h:i A') . ' ' .  config('app.timezone');
    }
    public static function getInvoice($project_id, $date)
    {
        $data = ['available' => false, 'data' => null];
        $invoice = Invoices::where([['project_id', $project_id], ['month_year', $date]]);
        if ($invoice->exists()) {
            $data['available'] = true;
            $data['data'] = $invoice->first();
        }
        return $data;
    }
    public static function generateDates($startAt, $_end, $_year, $project_id)
    {
        $array = array();
        $year = $_year . '-01-01';
        $end = "$_year-12-31";
        if (strtotime($end) > strtotime($_end)) {
            $end = $_end;
        }
        $interval = new DateInterval('P1D');
        if (strtotime($year) < strtotime($startAt)) {
            $start = new DateTime($startAt);
        } else {
            $start = new DateTime($year);
        }
        $realEnd = new DateTime($end);
        $period = new DatePeriod($start, $interval, $realEnd);
        $startDate = (int) $start->format('d');
        $startMonth = $start->format('m') . '-' . $start->format('Y');

        foreach ($period as $date) {
            $array[$date->format('m') . '-' . $date->format('Y')] = [
                'year' => $date->format('Y'),
                'month' => $date->format('m'),
                'start' => 01,
                'end' => (int) $date->format('d'),
                'hours' => (int) $date->format('d') * 24,
                'days' => (int) $date->format('d'),
                'invoice' => Self::getInvoice($project_id, $date->format('M, Y')),
            ];
        }
        if (strtotime($year) < strtotime($startAt)) {
            $lastDate = $array[$startMonth]['year'] . '-' . $array[$startMonth]['month'] . '-' . $array[$startMonth]['end'];
            $array[$startMonth]['start'] = $startDate;
            $array[$startMonth]['days'] = $array[$startMonth]['end'] - $startDate;
            $array[$startMonth]['hours'] = SELF::getDiff(strtotime($startAt), strtotime($lastDate), "hours");
        }
        return array_reverse(array_values($array));
        //return $array;
    }

    public static function getCostTillDate($servers)
    {
        $start = date('Y-m') . '-01';
        $end = Carbon::now();
        $total = 0;
        $invoice = new InvoiceController();

        foreach ($servers as $server) {
            $getCost = $invoice->getServerCost($server, date('Y-m-d h:i:s'), true);
            $total += ($getCost) ? $getCost['totalCharge'] : 0;
        }
        return [
            'hours' => SELF::getDiff(strtotime($start), strtotime($end), "hours"),
            'cost' => round($total, 2),
        ];
    }

    public static function getEstimated($servers)
    {
        $start = date('Y-m') . '-01';
        $end = date('Y-m-t');
        $total = 0;
        $invoice = new InvoiceController();
        $ser = [];
        foreach ($servers as $server) {
            $getCost = $invoice->getServerCost($server, date('Y-m'));
            $ser[] = $getCost;
            $total += ($getCost) ? $getCost['totalCharge'] : 0;
        }
        return [
            'hours' => SELF::getDiff(strtotime($start), strtotime($end), "hours"),
            'cost' => round($total, 2)
        ];
    }

    public static function getSizeDetails($slug)
    {
        $size = ServerSize::where('slug', $slug);
        if ($size->exists()) {
            return $size->first();
        } else {
            return false;
        }
    }
    public static function isTaxEnabled()
    {
        return [
            'status' => false,
            'tax' => 18
        ];
    }
    public static function previousArrears($invoiceDate, $project, $user)
    {
        $preArrears = 0;
        $preMonth = date('M, Y', strtotime($invoiceDate . " -1 month"));
        $invoice = Invoices::where([
            ['user_id', $user],
            ['project_id', $project],
            ['month_year', $preMonth],
            ['payment_date', null],
            ['status', 'unpaid']
        ]);
        if ($invoice->exists()) {
            $preArrears = $invoice->first()->grand_total;
        }
        return $preArrears;
    }
}
