<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\Server;

class DashboardController extends Controller
{
    public function availableSizes()
    {
        return CommonFunctions::sendResponse(1, "List of available Sizes", CommonFunctions::$availableSizes);
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
                    $server->delete();
                    return CommonFunctions::sendResponse(1, "Droplet Destroyed", json_decode($response));
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

        if(!empty($name) && !empty($size) ){
            if(!CommonFunctions::validateSize($size)){
                return CommonFunctions::sendResponse(0, "Invalid Droplet Size");
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
            
            $response = CommonFunctions::makeRequest("/droplets","POST",json_encode($body));
            $response = json_decode($response);
            if($response->droplet){
                $droplet_id = $response->droplet->id;
                $server = new Server();
                $server->droplet_id = $droplet_id;
                $server->name = $name;
                $server->size = $size;
                $server->memory = $response->droplet->memory;
                $server->vcpus = $response->droplet->vcpus;
                $server->disk = $response->droplet->disk;
                $server->user_id = $user->id;
                $server->save();
                return CommonFunctions::sendResponse(1, "Server Created Successfully", $response);
            }
            return CommonFunctions::sendResponse(0, "Something Went Wrong While creating a Droplet", $response);
        }
        return CommonFunctions::sendResponse(0, "All Fields required");
    }
    public function droplets(Request $request){
        $user = auth()->user();
        $servers = Server::where("user_id", $user->id)->get();
        return CommonFunctions::sendResponse(1, "Your droplets", $servers);
    }
}
