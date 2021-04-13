<?php

namespace App\Http\Controllers\admin\droplet;

use App\Models\AdminUsers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\Project;

class ProjectController extends Controller
{
    public function allProjects(Request $request)
    {
        $user = AdminUsers::find(auth()->user()->id);
        $withTrashed = ($request->trashed === 1) ? true : false;
        $sort = CommonFunctions::checkQueryString($request);
        $in = $request->input();

        error_log(json_encode($sort));
        // sleep(5);
        if ($user->can('droplets.projects.view')) {
            $data = Project::join('users', 'projects.user_id', '=', 'users.id')
                ->select(['projects.id as id', 'projects.name as projects.name', 'users.name as users.name', 'projects.id as projects.id', 'user_id', 'projects.created_at as projects.created_at'])
                ->with('droplets')
                ->with('applications')
                ->withCount('droplets')
                ->withCount('applications');
            if ($in['filter'] !== null) {
                if (isset($in['filter']['user'])) {
                    $data->whereHas('user', function ($q) use ($in) {
                        if ($in['filter']['user'] !== '') {
                            $q->where('name', 'LIKE', '%' . $in['filter']['user'] . '%');
                        }
                    });
                } else {
                    $data->where(function ($q) use ($in) {
                        foreach ($in['filter'] as $column => $value) {
                            if ($value !== null || $value !== '') {
                                $q = $q->where($column, 'LIKE', '%' . $value . '%');
                            }
                        }
                    });
                }
            }
            if ($withTrashed) {
                $data->onlyTrashed();
            }
            $data = $data->orderBy($sort->column, $sort->asc)
                ->paginate($sort->perPage);

            return CommonFunctions::sendResponse(1, "Access Granted", $data);
        } else {
            return CommonFunctions::sendResponse(0, "Permission Denied", null);
        }
    }
}
