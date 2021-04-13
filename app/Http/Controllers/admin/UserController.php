<?php

namespace App\Http\Controllers\admin;

use App\Models\AdminUsers as User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\AdminUsers;
use Carbon\Carbon;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{


    public function default()
    {
        return CommonFunctions::sendResponse(0, "route not found");
    }
    public function returnToFrontEnd(Request $request, $token)
    {
        $email = $request->get('email');
        return redirect(config('app.admin_url') . "/admin/reset-password/$token/$email");
    }
    public function checkLogin(Request $request)
    {
        $header = $request->header('Authorization');
        if (Str::startsWith($header, 'Bearer ')) {
            $auth_header = Str::substr($header, 7);
            $token = explode(':', $auth_header);
            $user = User::find($token[0]);
            if (!$user->hasPermissionTo('access-admin-panel')) {
                return CommonFunctions::sendResponse(0, "Invalid User", []);
            }
            if ($user && (count($token) > 1)) {
                $tokens = json_decode($user->access_tokens);
                if (($key = array_search($auth_header, $tokens)) !== false) {
                    if ($user->hasVerifiedEmail()) {
                        $permissions = [];
                        if (count($user->getAllPermissions()) > 1) {
                            foreach ($user->getAllPermissions() as $permission) {
                                $permissions[] = ['name' => $permission->name];
                            };
                        }
                        return CommonFunctions::sendResponse(1, "user valid", $permissions);
                    } else {
                        return CommonFunctions::sendResponse(0, "Email Not Verified");
                    }
                }
            }
        }
        return CommonFunctions::sendResponse(0, "user not valid", false);
    }
    public function resetPassword(Request $request)
    {
        $password = $request->get('password');
        $token = $request->get('token');
        $password_confirmation = $request->get('password_confirmation');
        $email = $request->get('email');
        // $credentials = ['password'=>$password, 'password_confirmation'=>$password_confirmation, 'token'=>$token];
        if (!empty($password) && !empty($password_confirmation) && !empty($token)) {
            if ($password == $password_confirmation) {
                $users = User::where("email", $email)->get();
                if (count($users) > 0) {
                    $user = $users[0];
                    if (!$user->hasPermissionTo('access-admin-panel')) {
                        return CommonFunctions::sendResponse(0, "Invalid User", true);
                    }
                    if (Password::tokenExists($user, $token)) {
                        $user->password = Hash::make($password);
                        $user->save();
                        Password::deleteToken($user);
                        return CommonFunctions::sendResponse(1, "Password Reset successfully");
                    }
                    return CommonFunctions::sendResponse(0, "Invalid Token");
                } else {
                    return CommonFunctions::sendResponse(0, "Email not found");
                }
                return CommonFunctions::sendResponse(1, "Password Reset Success");
            }
            return CommonFunctions::sendResponse(0, "Password Did Not Matched");
        }
        return CommonFunctions::sendResponse(0, "All Data required");
    }
    public function changePassword(Request $request)
    {
        $password = $request->get('password');
        $password_confirmation = $request->get('password_confirmation');
        $old_password = $request->get('current_password');
        $email = auth()->user()->email;

        // $credentials = ['password'=>$password, 'password_confirmation'=>$password_confirmation, 'token'=>$token];
        if ($password_confirmation !== $password) {
            return CommonFunctions::sendResponse(0, "Password did not matched");
        }
        if (!empty($password) && !empty($old_password) && !empty($email)) {
            $users = User::where("email", $email)->get();
            if (count($users) > 0) {
                $user = $users[0];
                if (!$user->hasPermissionTo('access-admin-panel')) {
                    return CommonFunctions::sendResponse(0, "Invalid User", true);
                }
                if (Hash::check($old_password, $user->password)) {
                    $user->password = Hash::make($password);
                    $user->save();
                    return CommonFunctions::sendResponse(1, "Password Changed.");
                } else {
                    return CommonFunctions::sendResponse(0, "Invalid old password");
                }
            } else {
                return CommonFunctions::sendResponse(0, "Email not found");
            }
        }
        return CommonFunctions::sendResponse(0, "All Data required");
    }
    public function verify(Request $request, $id)
    {

        $success_route = config("app.admin_url") . "/admin/login";

        $user = User::find($id);
        if (!$user->hasPermissionTo('access-admin-panel')) {
            return redirect($success_route . '/invalid-user');
        }
        if (!$user) {
            return redirect($success_route . '/invalid-user');
        }
        if ($user->hasVerifiedEmail()) {
            return redirect($success_route . '/already-verified');
        }
        if ($user->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }
        return redirect($success_route . '/verified');
    }
    public function reset(Request $request)
    {
        $email =  $request->get('email');
        if (!empty($email)) {
            $users = User::where("email", $email)->get();
            if (count($users) > 0) {
                $user = $users[0];
                if (!$user->hasPermissionTo('access-admin-panel')) {
                    return CommonFunctions::sendResponse(0, "Invalid User", true);
                }
                $token = Password::getRepository()->create($user);
                $user->sendPasswordResetNotification($token);
                return CommonFunctions::sendResponse(1, "Password Reset Mail sent successfully");
            } else {
                return CommonFunctions::sendResponse(0, "Email not found");
            }
        } else {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
    }
    public function resend(Request $request)
    {
        $email =  $request->get('email');
        if (!empty($email)) {
            $users = User::where("email", $email)->get();
            if (count($users) > 0) {
                $user = $users[0];
                if (!$user->hasPermissionTo('access-admin-panel')) {
                    return CommonFunctions::sendResponse(0, "Invalid User", true);
                }
                if ($user->hasVerifiedEmail()) {
                    return CommonFunctions::sendResponse(1, "Email already verified.");
                }
                $user->sendEmailVerificationNotification();
                return CommonFunctions::sendResponse(1, "Verification mail Resend successfully");
            } else {
                return CommonFunctions::sendResponse(0, "Email not found");
            }
        } else {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
    }
    public function register(Request $request)
    {
        $name = $request->get('name');
        $email = $request->get('email');
        $password = $request->get('password');
        $conf_password = $request->get('confirm_password');
        $role = $request->role;

        if (!empty($name) &&  !empty($email) && !empty($password)) {
            if ($password == $conf_password) {
                $users = User::where("email", $email)->get();
                if (count($users) < 1) {
                    $user = new User();
                    $user->name = $name;
                    $user->email = $email;
                    $user->email_verified_at = Carbon::now();
                    $user->password = Hash::make($password);
                    $user->access_tokens = json_encode([]);
                    $user->save();
                    // Assign Role
                    $user->assignRole($role);
                    // $user->sendEmailVerificationNotification();
                    return CommonFunctions::sendResponse(1, "User Added Successfully");
                } else {
                    return CommonFunctions::sendResponse(0, "Email Already Registered");
                }
            } else {
                return CommonFunctions::sendResponse(0, "Passwords did not matched");
            }
        } else {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
    }
    public function login(Request $request)
    {
        $email = $request->get('email');
        $password = $request->get('password');

        if (!empty($email) && !empty($password)) {
            $users = User::where("email", $email)->get();
            if (count($users) > 0) {
                if (Auth::attempt(['email' => $email, 'password' => $password])) {
                    $user = User::find(Auth::user()->id);

                    if (!$user->hasVerifiedEmail()) {
                        return CommonFunctions::sendResponse(0, "Email Not Verified", true);
                    }
                    if (!$user->hasPermissionTo('access-admin-panel')) {
                        return CommonFunctions::sendResponse(0, "Invalid User", true);
                    }
                    if ($user->locked === 1) {
                        return CommonFunctions::sendResponse(0, "Your Account Is Locked, Please Contact Admin", true);
                    }
                    $token_key = Str::random(32);
                    $token = $user->id . ":" . $token_key;
                    $tokens = json_decode($user->access_tokens);
                    array_push($tokens, $token);
                    $user->access_tokens = $tokens;
                    $user->save();
                    return CommonFunctions::sendResponse(1, "Login Success", $user);
                } else {
                    return CommonFunctions::sendResponse(0, "Login Failed");
                }
            } else {
                return CommonFunctions::sendResponse(0, "Email not found.");
            }
        } else {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
    }
    public function logout(Request $request)
    {
        $header = $request->header('Authorization');
        if (Str::startsWith($header, 'Bearer ')) {
            $auth_header = Str::substr($header, 7);
            $token = explode(':', $auth_header);
            $user = User::find($token[0]);

            if ($user && (count($token) > 1)) {
                $tokens = json_decode($user->access_tokens);
                $user->access_tokens = [];
                $user->save();
                Auth::logout();
                return CommonFunctions::sendResponse(1, "Logged out", $user->access_tokens);
            }
        }
        return CommonFunctions::sendResponse(0, "Logged out failed");
    }

    public function allUsers(Request $request)
    {
        $user = AdminUsers::find(auth()->user()->id);
        $withTrashed = ($request->trashed === 1) ? true : false;
        $sort = CommonFunctions::checkQueryString($request);
        $in = $request->input();

        error_log(json_encode($sort));
        // sleep(5);
        if ($user->can('dashboard.users.view')) {
            $users = AdminUsers::permission('access-admin-panel')
                ->select('id', 'name', 'email', 'created_at', 'locked');
            if ($in['filter'] !== null) {
                $users->where(function ($q) use ($in) {
                    foreach ($in['filter'] as $column => $value) {
                        if ($value !== null || $value !== '')
                            $q = $q->where($column, 'LIKE', '%' . $value . '%');
                    }
                });
            }
            if ($withTrashed) {
                $users->onlyTrashed();
            }
            $users = $users->orderBy($sort->column, $sort->asc)
                ->paginate($sort->perPage);
            return CommonFunctions::sendResponse(1, "Access Granted", $users);
        } else {
            return CommonFunctions::sendResponse(0, "Permission Denied", null);
        }
    }

    public function getRoles()
    {
        $allRoles = Role::all();
        $allPermissions = Permission::all();
        $roles = [];
        $i = 0;
        foreach ($allRoles as $role) {
            $roles['roles'][$i]['name'] = $role->name;
            $roles['roles'][$i]['id'] = $role->id;
            $roles['roles'][$i]['permissions'] = $role->permissions()->get(['name', 'id']);
            $i++;
        }
        $roles['permissions'] = $allPermissions;
        return CommonFunctions::sendResponse(1, "Access Granted", $roles);
    }

    public function changeAccess(Request $request)
    {
        $role = $request->role;
        $password = $request->password;
        $permissions = $request->permission;

        $user = AdminUsers::find($request->user);
        $user->syncRoles([$role]);
        $user->syncPermissions($permissions);
        // change password
        if (!empty($password)) {
            $user->password = Hash::make($request->password);
            $user->save();
        }
        error_log(json_encode($request->input()));
        return CommonFunctions::sendResponse(1, "Access Changed Successfully");
    }
}
