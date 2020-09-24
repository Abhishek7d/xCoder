<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Server;
use App\Http\Controllers\helpers\CommonFunctions;

class ServiceController extends Controller
{
    private $checkStatus = "systemctl is-active SERVICE";
    private $step_one = "cd /usr/local/vesta/bin/\n";
    
    public function getStatus(Request $request, $server){
        $server = Server::find($server);
        if(!$server){
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if(!$server->user_id==auth()->user()->id){
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
        $ngnix_status = $ssh->exec(str_replace("SERVICE", "mysql", $this->checkStatus));
        
        $data = ['nginx'=>trim($ngnix_status), 'apache'=>trim($apache_status), 'mysql'=>trim($mysql_status)];

        return CommonFunctions::sendResponse(1, "Service Status", $data);

    }
    public function setService(Request $request, $server)
    {
        $service = $request->get("service");
        $action = $request->get("action");
        $service_name = "";
        $action_name = "";
        if(empty($service) || empty($action)){
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }

        $server = Server::find($server);
        if(!$server){
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if(!$server->user_id==auth()->user()->id){
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        switch ($service){
            case "apache":
                $service_name = "apache2";
            break;
            case "mysql":
                $service_name = "mysql";
            break;
            case "nginx":
                $service_name = "nginx";
            break;
            default:
                return CommonFunctions::sendResponse(0, "Invalid Service Name");
            break;
        }
        
        switch($action){
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
        return CommonFunctions::sendResponse(1, "Service successfully $action_name"."ed");
    }
}
