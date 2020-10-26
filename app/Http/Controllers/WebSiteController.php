<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ApplicationInstaller;
use App\Models\Server;
use App\Http\Controllers\helpers\CommonFunctions;
use phpseclib\Crypt\RSA;
use phpseclib\Net\SSH2;
use App\Models\Application;

class WebSiteController extends Controller
{
    private $step_one = "cd /usr/local/vesta/bin/\n";
    private $wp_download_link = "https://wordpress.org/latest.zip";
    private $sample_wp_config = __DIR__."/helpers/wp-config.sample.txt";
 
    private function is_valid_domain_name($domain_name){
        return (preg_match("/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i", $domain_name) 
                && preg_match("/^.{1,253}$/", $domain_name) 
                && preg_match("/^[^\.]{1,63}(\.[^\.]{1,63})*$/", $domain_name)   );
    }

    public function removeDomain(Request $request, $application){
        $application = Application::find($application);
        if(!$application){
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if($application->user_id != auth()->user()->id){
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $ssh->write($this->step_one);
        $ssh->write("./v-delete-domain admin $application->domain\n");
        $output = $ssh->read();
        $application->delete();
        return CommonFunctions::sendResponse(1, "Application Deleted Successfully", $output);
    }
    public function showDomains(){
        $apps = Application::where("user_id", auth()->user()->id)->with('server')->get();
        return CommonFunctions::sendResponse(1, "List of applications",$apps);
    }
    public function addDomain(Request $request){
        
        $domain = $request->get('domain');
        $server = $request->get('server');
        if(empty($server) || empty($domain) ){
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        $install_wp = true;
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
        $exists = Application::where(["domain"=>$domain, 'server_id'=>$server->id])->get();
        if(count($exists) > 0){
            return CommonFunctions::sendResponse(0, "Domain Already added to this server");
        }
        $application = $this->createApplicationToServer($server, $domain, auth()->user());
        return CommonFunctions::sendResponse(1,"Domain added to the server", $application);
    }
    public function createApplicationToServer($server, $name, $user){   
        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        $connection =  @socket_connect($socket, $server->ip_address, 22);
        if(!$connection || !$server->ip_address){
            return CommonFunctions::sendResponse(0, "Server unreachable");
        }

        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        //move to command path
        $ssh->write($this->step_one);
        //add webiste
        $domain = CommonFunctions::generateRandomString(5).$user->ID;
        $domain_name = $domain.".".env('DEFAULT_MASTER_DOMAIN');
        $ssh->write("./v-add-domain admin $domain_name $server->ip_address\n");
        
        //create Application
        $application = new Application();
        $application->name = $name;
        $application->domain = $domain_name;
        $application->server_id = $server->id;
        $application->ip_address = $server->ip_address;
        $application->user_id = $user->id;
        $application->status = CommonFunctions::$application_statuses[2];
        $install_wp = true;
        if($install_wp){
            //create database
            $db_password = CommonFunctions::generateRandomString(8);
            $db_name = $domain;
            // $ssh->write("./v-delete-database admin admin_$db_name\n");
            $ssh->write("./v-add-database admin $db_name $db_name $db_password mysql\n");
            
            $ssh->write("cd /home/admin/web/$domain_name/public_html\n");
            
            $ssh->write("su admin\n");
            $ssh->write("wget ".$this->wp_download_link."\n");
            $ssh->write("unzip latest.zip\n");
            $ssh->write("mv ./wordpress/* ./ && mv ./wordpress/.* ./ \n");
            $ssh->write("rm -rf latest.zip wordpress index.html robots.txt\n");
            $table_prefix = '$table_prefix';
            $config = file_get_contents($this->sample_wp_config);
            $config = str_replace("VESTA_DB_NAME", "admin_$db_name", $config);
            $config = str_replace("VESTA_DB_USER", "admin_$db_name", $config);
            $config = str_replace("VESTA_DB_PASSWORD", $db_password, $config);
            $ssh->write("$config\n");
            $application->db_name = "admin_$domain";
            $application->db_username = "admin_$domain";
            $application->db_password = $db_password;
        }
        $ssh = new SSH2("127.0.0.1");
        $output = null;
        if ($ssh->login('root', "Dibyendu#1")) {
            $output = $ssh->exec("v-add-dns-record admin parvaty.me $domain_name A $server->ip_address");
        }
        $application->save();
        $ssh->read();
        
        return [$application, $output];
    }
}
