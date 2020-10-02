<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Server;
use App\Models\User;
use App\Http\Controllers\helpers\CommonFunctions;
use phpseclib\Crypt\RSA;
use phpseclib\Net\SSH2;

class ServerInstaller​ implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $server = null;
    public $step_zero = "screen \n";
    public $step_one = "curl -O http://vestacp.com/pub/vst-install.sh";
    public $step_two = 'bash vst-install.sh --nginx yes --apache yes --phpfpm no --named yes --remi yes --vsftpd yes --proftpd no --iptables yes --fail2ban yes --quota no --exim yes --dovecot yes --spamassassin yes --clamav yes --softaculous no --mysql yes --postgresql no --hostname IP_ADDRESS --email USER_EMAIL --password USER_PASSWORD -f -y no ';
    public $step_two_cmd = " && wget APP_URL/completed/SERVER_ID/HASHED";
    public function __construct(Server $server)
    {
        $this->server = $server;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $server = $this->server;

        $server_id = "SERVER:".$server->id;
        $key = array_search($server->status, CommonFunctions::$server_statuses, true);
        if($key >= 2 && false){
            die("Server is ".$server->status);
        }

        $server->status = CommonFunctions::$server_statuses[1];
        $server->save();
        $response = CommonFunctions::makeRequest("/droplets?tag_name=".$server_id);
        if($response['status']==false){
            echo "something wente wrong on control panel";
            die();
        }else{
            $response = json_decode($response['data']);
            $droplets = $response->droplets;
            if(count($droplets)<1){
                echo "Droplet Doesn't exist";
                die();
            }else{
                $droplet = $droplets[0];
                if($droplet->networks && $droplet->networks->v4 && count($droplet->networks->v4)>0){
                    $found = false;
                    foreach($droplet->networks->v4 as $address){
                        if($address->type=="public"){
                            $found = $address->ip_address;
                        }
                    }
                    if(!$found){
                        echo "Server Not Ready";
                        sleep(10);
                        ServerInstaller​::dispatch($server);
                        die;
                    }
                    $network = $droplet->networks->v4[0];
                    $server->status = CommonFunctions::$server_statuses[2];
                    $server->ip_address = $found;
                    $server->password = CommonFunctions::generateRandomString(8);
                    $server->hashed = CommonFunctions::generateRandomString(98);
                    $server->save();

                    $port = '22';

                    $fp = fsockopen($server->ip_address, $port, $errno, $errstr, 300);
                    if($fp){
                        $key = new RSA();
                        $key->loadKey(file_get_contents('../ssh-keys/parvaty-cloud-hosting'));
                        $ssh = new SSH2($server->ip_address);
                        
                        if (!$ssh->login('root', $key)) {
                            exit('Login Failed');
                        }
                        $user = User::find($server->user_id);
                        $this->step_two = str_replace('IP_ADDRESS', $server->ip_address, $this->step_two);
                        $this->step_two = str_replace('USER_EMAIL', $user->email, $this->step_two);
                        $this->step_two = str_replace('USER_PASSWORD', $server->password, $this->step_two);
                        $this->step_two_cmd = str_replace("APP_URL", env('APP_URL'), $this->step_two_cmd);
                        $this->step_two_cmd = str_replace("SERVER_ID", $server->id, $this->step_two_cmd);
                        $this->step_two_cmd = str_replace("HASHED", $server->hashed, $this->step_two_cmd);
                        $ssh->exec($this->step_one);
                        $ssh->exec('screen -dmS vestacp');
                        $ssh->exec("screen -S vestacp -X stuff '$this->step_two $this->step_two_cmd\n'");
                        return CommonFunctions::sendResponse(1,"Server Installation started");
                    } 
                    else{   
                        echo "Server Unreachable";
                        sleep(10);
                        ServerInstaller​::dispatch($server);
                    }
                }else{
                    echo "Server Not Ready";
                    sleep(10);
                    ServerInstaller​::dispatch($server);
                }
            }
        }
    }
}
