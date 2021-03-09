<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Server;
use App\Http\Controllers\helpers\CommonFunctions;

class ServiceController extends Controller
{
    private $checkStatus = "systemctl is-active SERVICE";
    private $step_one = "cd /usr/local/vesta/bin/\n";

    private function filterDisplayData($data)
    {
        $data = explode("\n", $data);
        $data = array_slice($data, 2);
        array_pop($data);
        $data = implode("\n", $data);
        $data = preg_replace("!\r?\n!", "", $data);
        return $data;
    }
    public function getStatus(Request $request, $server)
    {
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        //move to command path
        $ssh->write($this->step_one);

        $apache_status = $ssh->exec(str_replace("SERVICE", "apache2", $this->checkStatus));
        $mysql_status = $ssh->exec(str_replace("SERVICE", "mysql", $this->checkStatus));
        $ngnix_status = $ssh->exec(str_replace("SERVICE", "nginx", $this->checkStatus));
        $cron_status = $ssh->exec(str_replace("SERVICE", "cron", $this->checkStatus));
        $vsftpd_status = $ssh->exec(str_replace("SERVICE", "vsftpd", $this->checkStatus));

        $data = ['nginx' => trim($ngnix_status), 'apache' => trim($apache_status), 'mysql' => trim($mysql_status), 'cron' => trim($cron_status), 'vsftpd' => trim($vsftpd_status)];

        return CommonFunctions::sendResponse(1, "Service Status", $data);
    }
    public function setService(Request $request, $server)
    {
        $service = $request->get("service");
        $action = $request->get("action");
        $service_name = "";
        $action_name = "";
        if (empty($service) || empty($action)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }

        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        switch ($service) {
            case "apache":
                $service_name = "apache2";
                break;
            case "mysql":
                $service_name = "mysql";
                break;
            case "nginx":
                $service_name = "nginx";
                break;
            case "cron":
                $service_name = "cron";
                break;
            case "vsftpd":
                $service_name = "vsftpd";
                break;
            default:
                return CommonFunctions::sendResponse(0, "Invalid Service Name");
                break;
        }

        switch ($action) {
            case "start":
                $action_name = "start";
                break;
            case "stop":
                $action_name = "stop";
                break;
            case "restart":
                $action_name = "restart";
                break;
            default:
                return CommonFunctions::sendResponse(0, "Invalid Action");
                break;
        }

        $output = $ssh->exec("systemctl $action_name $service_name");
        return CommonFunctions::sendResponse(1, "Service successfully $action_name" . "ed");
    }

    public function getResources(Request $request, $server)
    {
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $data = $ssh->exec("cat /proc/meminfo");
        $data = explode("\n", $data);

        $total = preg_split('/[\s]+/', $data[0]);
        $free = preg_split('/[\s]+/', $data[1]);
        $available = preg_split('/[\s]+/', $data[2]);
        $memory = ['total' => $total, 'free' => $free, 'available' => $available];

        $cpu = $ssh->exec("grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'");

        $disk = $ssh->exec("df -h /");
        $disk = explode("\n", $disk);
        $disk = $disk[1];
        $disk = preg_split('/[\s]+/', $disk);
        $disk = ["total" => $disk[1], "used" => $disk[2], "available" => $disk[3], "usage" => $disk[4]];
        $rsp = ["cpu" => trim($cpu) . "%", "disk" => $disk, "memory" => $memory];

        return CommonFunctions::sendResponse(1, "Available Resouces", $rsp);
    }

    public function getCronjobs(Request $request, $server)
    {
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $data = $ssh->exec('pwd');
        $ssh->write("cd /usr/local/vesta/bin/\n");
        $ssh->write("v-list-cron-jobs admin json\n");
        $data = $ssh->read();
        $data = $this->filterDisplayData($data);
        $data = explode("v-list-cron-jobs admin json", $data);
        $data = array_pop($data);
        $data = json_decode($data);
        $newList = [];
        $i = 1;
        foreach ($data as $key => $d) {
            if ($i > 9 && $d->CMD != "sudo /usr/local/vesta/bin/v-update-letsencrypt-ssl") {
                array_push($newList, $d);
            }
            $i++;
        }
        return CommonFunctions::sendResponse(1, "List of Cron jobs", $newList);
    }
    public function addCronjob(Request $request, $server)
    {
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $min = $request->get('min');
        $hour = $request->get('hour');
        $day = $request->get('day');
        $month = $request->get('month');
        $wday = $request->get('wday');
        $command = $request->get('command');
        // echo "v-add-cron-job admin $min $hour $day $month $wday $command";
        // die;
        if (empty($min) || empty($hour) || empty($day) || empty($month) || empty($wday) || empty($command)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $data = $ssh->exec('pwd');
        $ssh->write("cd /usr/local/vesta/bin/\n");

        $ssh->write("v-add-cron-job admin $min $hour $day $month $wday '$command'\n");

        $data = $ssh->read();
        $data = $this->filterDisplayData($data);
        //var_dump($data);die;
        $data = explode("$command'", $data);
        $data = array_pop($data);
        // $data = json_decode($data);
        $data = explode("Error:", $data);
        if (count($data) > 1) {
            $data = explode("::", array_pop($data));
            return CommonFunctions::sendResponse(0, trim($data[0]));
        }
        return CommonFunctions::sendResponse(1, "Cron job added");
    }

    public function setCronjob(Request $request, $server, $cronjob)
    {
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $action = $request->get('action');
        if (!$cronjob) {
            return CommonFunctions::sendResponse(0, "Invalid cron job");
        }
        $cmd = "";
        switch ($action) {
            case "delete":
                $cmd = "v-delete-cron-job admin $cronjob";
                break;
            case "suspend":
                $cmd = "v-suspend-cron-job admin $cronjob";
                break;
            case "unsuspend":
                $cmd = "v-unsuspend-cron-job admin $cronjob";
                break;
            case "change":
                $min = $request->get('min');
                $hour = $request->get('hour');
                $day = $request->get('day');
                $month = $request->get('month');
                $wday = $request->get('wday');
                $command = $request->get('command');
                if (empty($min) || empty($hour) || empty($day) || empty($month) || empty($wday) || empty($command)) {
                    return CommonFunctions::sendResponse(0, "All cron data are required");
                }
                $cmd = "v-change-cron-job admin $cronjob $min $hour $day $month $wday '$command'";
                break;
            default:
                return CommonFunctions::sendResponse(0, "Invalid Operation");
                break;
        }

        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $data = $ssh->exec('pwd');
        $ssh->write("cd /usr/local/vesta/bin/\n");

        $ssh->write("$cmd\n");

        $data = $ssh->read();
        $data = $this->filterDisplayData($data);
        $data = explode("v-update-sys-vesta-all'", $data);
        $data = array_pop($data);
        $data = explode("::", $data);
        if (count($data) > 1) {
            return CommonFunctions::sendResponse(0, trim($data[0]));
        }
        return CommonFunctions::sendResponse(1, "Cron job successfully $action" . "ed", $data);
    }
}
