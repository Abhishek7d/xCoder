<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Http\Controllers\helpers\CommonFunctions as CF;
use App\Http\Controllers\WebSiteController;
use App\Models\Server;
use App\Models\Application;
use App\Jobs\ServerInstaller​;
use App\Models\Project;
use App\Models\User;
use App\Models\DelegateAccess;
use App\Models\Notifications;
use App\Notifications\DelegateAccessInvitation;
use Artisan;
use Illuminate\Support\Facades\Redis;

class DashboardController extends Controller
{
    public function projects($all = false)
    {
        $perPage = '';
        $user = auth()->user();
        $projects = Project::where("user_id", $user->id);
        if ($all) {
            $perPage = $projects->count();
        }
        $projects = $projects->with('servers')->with('delegateUsers')->with('applications')->paginate($perPage);
        return CommonFunctions::sendResponse(1, "Your projects", $projects);
    }
    public function createProject(Request $request)
    {
        $projectName = $request->get('name');
        if (empty($projectName)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        $project = new Project();
        $project->name = $projectName;
        $project->user_id = auth()->user()->id;
        $project->save();
        return CommonFunctions::sendResponse(1, "Project created successfully");
    }
    public function deleteProject(Request $request)
    {
        $project = Project::find($request->id);
        $servers = Server::where('project_id', $project->id)->get();
        foreach ($servers as $server) {
            // delete droplets
            // CommonFunctions::makeRequest("/droplets/$server->droplet_id", "DELETE");
            $server->delete();
        }
        $project->delete();
        return CommonFunctions::sendResponse(1, "Project deleted successfully", $servers);
    }
    public function delegateAccess(Request $request)
    {
        $email = $request->get('email');
        $project = $request->get('project');
        if (empty($email)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        if (empty($project)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        //$project = CF::projectId($project);
        $uid = User::where('email', $email);
        if (!$uid->exists()) {
            return CommonFunctions::sendResponse(0, "Invalid Email ID");
        }
        $da = DelegateAccess::where([['project_id', $project], ['_delegate_user_id', $uid->first()->id]]);
        if ($da->exists()) {
            return CommonFunctions::sendResponse(0, "This user already have access");
        }
        $access = new DelegateAccess();
        $access->user_id = auth()->user()->id;
        $access->_delegate_user_id = $uid->first()->id;
        $access->project_id = $project;
        $access->save();
        $uid->first()->notify(new DelegateAccessInvitation());
        $msg = "You have recieved a delegate access invitation from " . auth()->user()->name . ", please check the delegate access section.";
        CommonFunctions::notifyUser($uid->first()->id, $msg);
        return CommonFunctions::sendResponse(1, "Invitation sent successfully");
    }
    public function getDelegateAccess($project)
    {
        $da = DelegateAccess::where([['user_id', auth()->user()->id], ['project_id', $project]])->with('details')->get();
        return CommonFunctions::sendResponse(1, "Users", $da);
    }

    public function delegateAccounts()
    {
        $da = DelegateAccess::where([['_delegate_user_id', auth()->user()->id]])->with('project')->get();
        return CommonFunctions::sendResponse(1, "Users", $da);
    }
    public function chamgeDuStatus(Request $request)
    {
        $duId = $request->get('id');
        $status = $request->get('status');

        if (empty($duId) || empty($status)) {
            return CommonFunctions::sendResponse(0, "Something Went wrong");
        }
        $du = DelegateAccess::find($duId);
        $du->status = $status;
        $du->save();
        return CommonFunctions::sendResponse(1, "User status changed to : $status");
    }
    public function deleteDu($id)
    {
        if (empty($id)) {
            return CommonFunctions::sendResponse(0, "Something Went wrong");
        }
        $du = DelegateAccess::find($id);
        $du->delete();
        return CommonFunctions::sendResponse(1, "User deleted successfully");
    }
    public function test()
    {
        $server = Server::get();
        $a = ServerInstaller​::dispatch($server[0]);
    }
    public function availableSizes()
    {
        $sizes = CommonFunctions::makeRequest("/sizes", "GET");
        if (!$sizes['status']) {
            return CommonFunctions::sendResponse(0, "Something Went wrong");
        }
        $sizes = json_decode($sizes['data'])->sizes;
        return CommonFunctions::sendResponse(1, "List of available Sizes", $sizes);
    }
    public function availableRegions()
    {
        $regions = CommonFunctions::makeRequest("/regions", "GET");
        if (!$regions['status']) {
            return CommonFunctions::sendResponse(0, "Something Went wrong");
        }
        $regions = json_decode($regions['data'])->regions;
        return CommonFunctions::sendResponse(1, "List of available Regions", $regions);
    }
    public function serverCompleted(Request $request, $server_id, $hashed)
    {
        $domain = $request->get("appName");
        $project_id = $request->get('project_id');
        $server = Server::find($server_id);
        if ($server->hashed == $hashed) {
            $server->status = CommonFunctions::$server_statuses[3];
            $server->save();
            if ($domain) {
                $controller = new WebSiteController();
                $user = User::find($server->user_id);
                $project_id = CF::projectId($project_id);
                return $controller->createApplicationToServer($server, $domain, $user, $project_id);
            }
            return 1;
        }
        return 0;
    }

    public function dropletAction(Request $request, $id)
    {
        $action = $request->get('action');
        $server = Server::find($id);
        $user = auth()->user();
        if ($server) {
            if ($server->user_id == $user->id) {
                if ($action == "destroy") {
                    $url = "/droplets/$server->droplet_id/destroy_with_associated_resources/dangerous";
                    $response = CommonFunctions::makeRequest($url, "DELETE", null, "X-Dangerous: true");
                    Application::where("server_id", $server->id)->delete();
                    $server->delete();
                    return CommonFunctions::sendResponse(1, "Droplet Destroyed");
                } elseif ($action == "resize") {
                    if ($server->status != "READY") {
                        return CommonFunctions::sendResponse(0, "Server is not ready yet");
                    }
                    $size = $request->get("size");
                    if (!$size) {
                        return CommonFunctions::sendResponse(0, "Invalid Size");
                    }
                    $url = "/droplets/$server->droplet_id/actions";
                    $body = [
                        "type" => "resize",
                        "disk" => true,
                        "size" => $size
                    ];
                    $response = CommonFunctions::makeRequest($url, "POST", json_encode($body));
                    $response = json_decode($response['data']);
                    if (isset($response->id) && $response->id == "unprocessable_entity") {
                        return CommonFunctions::sendResponse(0, $response->message);
                    } else {
                        $server->size = $size;
                        $tmp = explode("-", $size);
                        $server->memory = (int)$tmp[2] * 1024;
                        $server->vcpus = (int)$tmp[1];
                        $server->save();
                        return CommonFunctions::sendResponse(1, "Droplet Upgraded", $response);
                    }
                }
                return CommonFunctions::sendResponse(0, "Invalid Droplet Action");
            }
            return CommonFunctions::sendResponse(0, "You dont have access to this resource");
        } else {
            return CommonFunctions::sendResponse(0, "Invalid Droplet ID");
        }
    }

    public function createDroplet(Request $request)
    {
        $name = $request->get('name');
        $size = $request->get('size');
        $project_id = $request->get('peojwct_id');
        $region = $request->get('region');
        $appName = $request->get('appName');
        if (empty($project_id)) {
            return CommonFunctions::sendResponse(0, "Invalid Project");
        }
        $project_id = CF::projectId($project_id);
        if (!empty($name) && !empty($size) && !empty($region) && !empty($appName)) {
            $sizes = CommonFunctions::makeRequest("/sizes", "GET");
            if (!$sizes['status']) {
                return CommonFunctions::sendResponse(0, "Something Went wrong");
            }
            $sizes = json_decode($sizes['data'])->sizes;
            $valid = false;
            foreach ($sizes as $s) {
                if ($s->slug == $size && in_array($region, $s->regions) && $s->available) {
                    $valid = true;
                }
            }
            if (!$valid) {
                return CommonFunctions::sendResponse(0, "Invalid Selection");
            }
            $user = CommonFunctions::userHasDelegateAccess($request->project_id);
            $body = [
                "name" => "Customer-" . $user->id,
                "region" => env("DEFAULT_REGION"),
                "size" => $size,
                "image" => env("DEFAULT_IMAGE"),
                "ssh_keys" => [
                    strval(env('DEFAULT_SSH_KEY'))
                ],
                "backups" => false,
                "ipv6" => true,
                "user_data" => null,
                "private_networking" => null,
                "volumes" => null,
                "tags" => [
                    env("DEFAULT_TAG"),
                    "CUSTOMER:$user->id",
                ]
            ];
            $response = [];
            $status = CommonFunctions::$server_statuses[0];
            $response = CommonFunctions::makeRequest("/droplets", "POST", json_encode($body));
            if (!$response['status']) {
                return CommonFunctions::sendResponse(0, "Request Faild", $response['data']);
            }
            $response = json_decode($response['data']);
            if ($response->droplet) {
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
                $server->project_id = $project_id;
                $server->save();

                $server_id = "SERVER:" . $server->id;
                $body = ["name" => $server_id];
                CommonFunctions::makeRequest("/tags", "POST", json_encode($body));
                $body = [
                    "resources" => [
                        [
                            "resource_id" => strval($droplet_id),
                            "resource_type" => "droplet"
                        ]
                    ]
                ];
                CommonFunctions::makeRequest("/tags/" . $server_id . "/resources", "POST", json_encode($body));
                CommonFunctions::releaseResponse(1, "Server Created Successfully", $server);
                set_time_limit(0);
                ServerInstaller​::dispatch($server, $appName);
                // return CommonFunctions::sendResponse(1, "Server Created Successfully", $server);
            }
            return CommonFunctions::sendResponse(0, "Something Went Wrong While creating a Droplet", $response);
        }
        return CommonFunctions::sendResponse(0, "All Fields required");
    }

    public function droplets(Request $request)
    {
        if ($request->project_id) {
            $user = CommonFunctions::userHasDelegateAccess($request->project_id);
            $servers = Server::where([['project_id', CF::projectId($request->project_id)], ["user_id", $user->id]])->with('applications')->with("storage")->with('project')->paginate();
            $msg = "Your Droplets";
            //TODO: FIX IT
            // if ($servers->count() == 0) {
            //     $msg = "Please create a server first.";
            // }
            // if ($user->delegateAccess) {
            //     if ($user->delegateStatus !== "active") {
            //         $msg = "You do not have access to the project";
            //     }
            //     if ($user->delegateStatus != "active" && $servers->count() == 0) {
            //         $msg = "Please create a server first.";
            //     }
            // }

            return CommonFunctions::sendResponse(1, $msg, $servers);
        } else {
            return CommonFunctions::sendResponse(0, "Please select a project first");
        }
    }
    public function notification()
    {
        $user = auth()->user();
        $notifications = Notifications::select('id', 'msg', 'created_at', 'status')->where('user_id', $user->id)->orderBy('id', 'DESC')->paginate();
        return CommonFunctions::sendResponse(1, 'Your Notifications', $notifications);
    }

    public function checkNotification()
    {
        $user = auth()->user();
        $notifications = Notifications::where([['status', 'new'], ['user_id', $user->id]])->count();
        return CommonFunctions::sendResponse(1, 'Your Notifications', $notifications);
    }

    public function changeNotificationStatus()
    {
        $notification = Notifications::where('status', 'new')->update(['status' => 'old']);
    }
}
