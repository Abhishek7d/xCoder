<?php

namespace App\Http\Controllers\admin\droplet;

use App\Models\AdminUsers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\helpers\CommonFunctions;

class ClientController extends Controller
{
    public function clients(Request $request)
    {
        $user = AdminUsers::find(auth()->user()->id);
        $withTrashed = ($request->trashed === 1) ? true : false;
        $sort = CommonFunctions::checkQueryString($request);
        $in = $request->input();

        error_log(json_encode($sort));
        // sleep(5);
        if ($user->can('droplets.users.view')) {
            $users = AdminUsers::doesntHave('roles')
                ->select('id', 'name', 'email', 'created_at', 'locked')->withCount('applications')->withCount('droplets');
            if ($in['filter'] !== null) {
                $users->where(function ($q) use ($in) {
                    foreach ($in['filter'] as $column => $value) {
                        if ($value !== null || $value !== '') {
                            $q = $q->where($column, 'LIKE', '%' . $value . '%');
                        }
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
}
