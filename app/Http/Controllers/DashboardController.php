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
use App\Notifications\ServerDeleteVerification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

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
    public function sendDeleteCode(Request $request)
    {

        $project = Project::find($request->id);
        $user = User::find(auth()->user()->id);
        // $user = CommonFunctions::userHasDelegateAccess($request->project_id);
        if (!$project) {
            return CommonFunctions::sendResponse(0, "Invalid Server");
        }
        if ($project->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You don't have access to this resource.");
        }
        $code = rand(100, 999) . "-" . CommonFunctions::reverse_string(time()) . "-" . rand(100, 999);
        $project->delete_code = $code;
        $project->save();
        // $user->notify(new ServerDeleteVerification($project->name, $code, $user));
        return CommonFunctions::sendResponse(1, "A Verification Code has been sent to your email id, please verify to delete this project");
    }
    public function deleteProject(Request $request)
    {
        $project = Project::find($request->id);
        if (!$project) {
            return CommonFunctions::sendResponse(0, "Invalid project");
        }
        $code = $request->get('code');
        if ($code != $project->delete_code) {
            return CommonFunctions::sendResponse(0, "Invalid code");
        }
        if (CommonFunctions::checkDeleteCode($code, $project->delete_code)) {
            $servers = Server::where('project_id', $project->id);
            if ($servers->exists()) {
                foreach ($servers as $server) {
                    // delete droplets
                    $url = "/droplets/$server->droplet_id/destroy_with_associated_resources/dangerous";
                    $response = CommonFunctions::makeRequest($url, "DELETE", null, "X-Dangerous: true");
                    Application::where("server_id", $server->id)->delete();
                }
            }
            DelegateAccess::where('project_id', $project->id)->delete();
            $project->delete();
            return CommonFunctions::sendResponse(1, "Project deleted successfully");
        } else {
            return CommonFunctions::sendResponse(0, "Code Expired");
        }
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

        $da = DelegateAccess::where([['project_id', $project], ['email', $email]]);
        if ($da->exists()) {
            return CommonFunctions::sendResponse(0, "This user already have access");
        }
        $uuid =  Str::uuid();
        $access = new DelegateAccess();
        $access->user_id = auth()->user()->id;
        $access->email = $email;
        $access->token = $uuid;
        if ($uid->exists()) {
            $access->_delegate_user_id = $uid->first()->id;
        } else {
            $access->_delegate_user_id = 0;
        }
        $access->project_id = $project;
        $access->save();
        if ($uid->exists()) {
            $uid->first()->notify(new DelegateAccessInvitation($uuid));
            $msg = "You have received a delegate access invitation from " . auth()->user()->name . ", please check the delegate access section to accept the invitation.";
            CommonFunctions::notifyUser($uid->first()->id, $msg);
        } else {
            Notification::route('mail', $email)->notify(new DelegateAccessInvitation($uuid));
        }

        return CommonFunctions::sendResponse(1, "Invitation sent successfully");
    }
    public function getDelegateAccess($project)
    {
        $da = DelegateAccess::where([['user_id', auth()->user()->id], ['project_id', $project]])->with('details')->get();
        return CommonFunctions::sendResponse(1, "Users", $da);
    }
    public function validateInvitation(Request $request)
    {
        $token = $request->get('token');
        $dA = DelegateAccess::where('token', $token)->first();
        if (User::where('email', $dA->email)->exists()) {
            $status = 'login';
        } else {
            $status = 'register';
        }
        $data = [
            'user' => User::find($dA->user_id)->name,
            'project' => Project::find($dA->project_id)->name,
            'status' => $status,
            'email' => $dA->email
        ];
        if ($dA->_delegate_user_id != 0) {
            $data['status'] = 'active';
        }
        return CommonFunctions::sendResponse(1, "Valid", $data);
    }
    public function acceptInvitation(Request $request)
    {
        $token = $request->get('token');
        $accept = $request->get('accept');
        $dA = DelegateAccess::where('token', $token)->first();
        $user = User::where('email', $dA->email);

        if (!$user->exists()) {
            return CommonFunctions::sendResponse(0, "Invalid user");
        }
        $dA->_delegate_user_id = $user->first()->id;
        $dA->status = ($accept) ? 'active' : 'rejected';
        $dA->save();
        return CommonFunctions::sendResponse(1, "Invitation accepted");
    }
    public function delegateAccounts()
    {
        $da = DelegateAccess::where([['_delegate_user_id', auth()->user()->id]])->with('project')->get();
        return CommonFunctions::sendResponse(1, "Users", $da);
    }
    public function changeDuStatus(Request $request)
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
    public function sendDeleteVerification(Request $request)
    {
        $serverId = $request->get('id');
        $server = Server::find($serverId);
        // $user = User::find(auth()->user()->id);
        $user = CommonFunctions::userHasDelegateAccess($request->project_id);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "Invalid Server");
        }
        if ($server->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You don't have access to this resource.");
        }
        $code = rand(100, 999) . "-" . CommonFunctions::reverse_string(time()) . "-" . rand(100, 999);
        $server->delete_code = $code;
        $server->save();
        //$user->notify(new ServerDeleteVerification($server->name, $code, $user));
        return CommonFunctions::sendResponse(1, "A Verification Code has been sent to your email id, please verify to delete this server");
    }
    public function dropletAction(Request $request, $id)
    {
        $action = $request->get('action');
        $code = $request->get('code');
        $server = Server::find($id);
        $user = CommonFunctions::userHasDelegateAccess($request->project_id);
        if ($server) {
            if ($server->user_id == $user->id) {
                if ($action == "destroy") {
                    $deleteCode = $server->delete_code;
                    if ($code != $deleteCode) {
                        return CommonFunctions::sendResponse(0, "Invalid Code");
                    }
                    if (CommonFunctions::checkDeleteCode($code, $deleteCode)) {
                        $url = "/droplets/$server->droplet_id/destroy_with_associated_resources/dangerous";
                        $response = CommonFunctions::makeRequest($url, "DELETE", null, "X-Dangerous: true");
                        Application::where("server_id", $server->id)->delete();
                        $server->delete_code = "";
                        $server->save();
                        $server->delete();
                        return CommonFunctions::sendResponse(1, "Droplet Destroyed");
                    } else {
                        $server->delete_code = "";
                        $server->save();
                        return CommonFunctions::sendResponse(0, "Code Expired");
                    }
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
            return CommonFunctions::sendResponse(0, "You don't have access to this resource");
        } else {
            return CommonFunctions::sendResponse(0, "Invalid Droplet ID");
        }
    }

    public function createDroplet(Request $request)
    {
        $name = $request->get('name');
        $size = $request->get('size');
        $project_id = $request->get('project_id');
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
        if (!Project::find(CF::projectId($request->project_id))) {
            return CommonFunctions::sendResponse(0, "Please select a project first");
        }
        if ($request->project_id) {
            $user = CommonFunctions::userHasDelegateAccess($request->project_id);
            $servers = Server::where([['project_id', CF::projectId($request->project_id)], ["user_id", $user->id]])->with('applications')->with("storage")->with('project')->paginate();
            $msg = "Your Droplets";
            //TODO: FIX IT
            if ($user->delegateAccess != 'active') {
                $msg = "You do not have access to this project.";
            } else {
                if ($servers->count() == 0) {
                    $msg = "Please create a server first.";
                }
            }

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
