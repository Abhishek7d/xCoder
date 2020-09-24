<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\AddWebsite​;
use App\Models\Server;
use App\Http\Controllers\helpers\CommonFunctions;
use phpseclib\Crypt\RSA;
use phpseclib\Net\SSH2;
use App\Models\Application;

class WebSiteController extends Controller
{
    private $step_one = "cd /usr/local/vesta/bin/\n";
    private $step_two = "./v-add-domain admin DOMAIN_NAME\n";

    private function is_valid_domain_name($domain_name){
        return (preg_match("/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i", $domain_name) 
                && preg_match("/^.{1,253}$/", $domain_name) 
                && preg_match("/^[^\.]{1,63}(\.[^\.]{1,63})*$/", $domain_name)   );
    }

    public function addDomain(Request $request){
        $domain = $request->get('domain');
        $server = $request->get('server');
        if(empty($server) || empty($domain) ){
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        if(!$this->is_valid_domain_name($domain)){
            return CommonFunctions::sendResponse(0, "Domain name is not valid");
        }
        $server = Server::find($server);

        if(!$server || $server->user_id != auth()->user()->id){
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if( gethostbyname($domain) != $server->ip_address ){
            return CommonFunctions::sendResponse(0, "Add an A record of $server->ip_address on your domain name provider");
        }
        

        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        $connection =  @socket_connect($socket, $server->ip_address, 22);
        if(!$connection || !$server->ip_address){
            return CommonFunctions::sendResponse(0, "Server unreachable");
        }

        $key = new RSA();
        $key->loadKey(file_get_contents('../ssh-keys/parvaty-cloud-hosting'));
        $ssh = new SSH2($server->ip_address);
        if (!$ssh->login('root', $key)) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        $this->step_two = str_replace('DOMAIN_NAME', $domain, $this->step_two);
        $ssh->write($this->step_one);
        $ssh->write($this->step_two);

        $application = new Application();
        $application->domain = $domain;
        $application->server_id = $server->id;
        $application->user_id = auth()->user()->id;
        $application->status = CommonFunctions::$application_statuses[0];
        $application->save();
        $output = $ssh->read();
        return CommonFunctions::sendResponse(1,"Domain added to the server", $output);
    }
}
