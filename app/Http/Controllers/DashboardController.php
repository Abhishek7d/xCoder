<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\Server;
use App\Models\Application;
use App\Jobs\ServerInstaller​;
use Artisan;

class DashboardController extends Controller
{
    
    public function test(){
        $server = Server::get();
        $a = ServerInstaller​::dispatch($server[0]);
    }
    public function availableSizes()
    {
        $sizes = CommonFunctions::makeRequest("/sizes","GET");
        if(!$sizes['status']){
            return CommonFunctions::sendResponse(0, "Something Went wrong");
        }
        $sizes = json_decode($sizes['data'])->sizes;
        return CommonFunctions::sendResponse(1, "List of available Sizes", $sizes);
    }
    public function availableRegions(){
        $regions = CommonFunctions::makeRequest("/regions","GET");
        if(!$regions['status']){
            return CommonFunctions::sendResponse(0, "Something Went wrong");
        }
        $regions = json_decode($regions['data'])->regions;
        return CommonFunctions::sendResponse(1, "List of available Regions", $regions);
    }
    public function serverCompleted(Request $request, $server_id, $hashed){
        $server = Server::find($server_id);
        if($server->hashed == $hashed){
            $server->status = CommonFunctions::$server_statuses[3];
            $server->save();
            return 1;
        }
        return 0;
    }
    public function destroyDroplet(Request $request, $id){
        $action = $request->get('action');
        if($action=="destroy"){
            $server = Server::find($id);
            $user = auth()->user();
            if($server){
                if($server->user_id==$user->id){

                    $url = "/droplets/$server->droplet_id/destroy_with_associated_resources/dangerous";
                    $response = CommonFunctions::makeRequest($url, "DELETE",null,"X-Dangerous: true");
                    Application::where("server_id", $server->id)->delete();
                    $server->delete();
                    return CommonFunctions::sendResponse(1, "Droplet Destroyed");
                }
                return CommonFunctions::sendResponse(0, "You dont have access to this resource");
            }else{
                return CommonFunctions::sendResponse(0, "Invalid Droplet ID");
            }
        }
        return CommonFunctions::sendResponse(0, "Invalid Droplet Action");
    }
    public function createDroplet(Request $request){
        $name = $request->get('name');
        $size = $request->get('size');
        $region = $request->get('region');

        if(!empty($name) && !empty($size) && !empty($region)){

            $sizes = CommonFunctions::makeRequest("/sizes","GET");
            if(!$sizes['status']){
                return CommonFunctions::sendResponse(0, "Something Went wrong");
            }
            $sizes = json_decode($sizes['data'])->sizes;
            $valid = false;
            foreach($sizes as $s){
                if($s->slug==$size && in_array($region, $s->regions) && $s->available){
                    $valid = true;
                }
            }
            if(!$valid){
                return CommonFunctions::sendResponse(0, "Invalid Selection");
            }
            
            $user = auth()->user();
            $body = [
                "name"=> "Customer-".$user->id,
                "region"=> env("DEFAULT_REGION"),
                "size"=> $size,
                "image"=> env("DEFAULT_IMAGE"),
                "ssh_keys"=> [
                    strval(env('DEFAULT_SSH_KEY'))
                ],
                "backups"=> false,
                "ipv6"=> true,
                "user_data"=> null,
                "private_networking"=> null,
                "volumes"=> null,
                "tags"=> [
                    env("DEFAULT_TAG"),
                    "CUSTOMER:$user->id",
                ]
            ];

            $status = CommonFunctions::$server_statuses[0];
            
            $response = CommonFunctions::makeRequest("/droplets","POST",json_encode($body));

            if(!$response['status']){
                return CommonFunctions::sendResponse(0, "Request Faild", $response['data']);
            }
            $response = json_decode($response['data']);
            if($response->droplet){
                $droplet_id = $response->droplet->id;
                $server = new Server();
                $server->droplet_id = $droplet_id;
                $server->name = $name;
                $server->size = $size;
                $server->status = $status;
                $server->region = $region;
                $server->memory = $response->droplet->memory;
                $server->vcpus = $response->droplet->vcpus;
                $server->disk = $response->droplet->disk;
                $server->user_id = $user->id;
                $server->save();

                $server_id = "SERVER:".$server->id;
                $body = ["name"=> $server_id];
                CommonFunctions::makeRequest("/tags","POST",json_encode($body));
                $body = [
                    "resources"=> [
                        [
                            "resource_id"=> strval($droplet_id),
                            "resource_type"=> "droplet"
                        ]
                    ]
                ];
                CommonFunctions::makeRequest("/tags/".$server_id."/resources","POST",json_encode($body));

                CommonFunctions::releaseResponse(1,"Server Created Successfully", $server);
                ServerInstaller​::dispatch($server);
                // return CommonFunctions::sendResponse(1, "Server Created Successfully", $server);
            }
            return CommonFunctions::sendResponse(0, "Something Went Wrong While creating a Droplet", $response);
        }
        return CommonFunctions::sendResponse(0, "All Fields required");
    }
    public function droplets(Request $request){
        $user = auth()->user();
        $servers = Server::where("user_id", $user->id)->with('applications')->get();
        return CommonFunctions::sendResponse(1, "Your droplets", $servers);
    }
}
