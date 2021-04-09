<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\helpers\CommonFunctions as CF;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ActionsController extends Controller
{
    public function deleteSelected(Request $request)
    {
        $selected_ids = $request->items;
        $table = $request->table;
        $force = $request->force;
        if (isset($selected_ids) && count($selected_ids) > 0 && !empty($table)) {
            // $model = "App\Models\/$table";
            if ($force !== 'true') {
                DB::table($table)->whereIn('id', $selected_ids)->update(['deleted_at' => Carbon::now()]);
            } else {
                DB::table($table)->whereIn('id', $selected_ids)->delete();
            }
            return CF::sendResponse(1, 'Deleted Successfully', $request->input());
        } else {
            return CF::sendResponse(0, 'Something went wrong.');
        }
    }

    public function setValue(Request $request)
    {
        $update = $request->update;
        $key = $request->key;
        $value = $request->value;
        $table = $request->table;
        error_log(json_encode($request->input()));
        if (!empty($key) && !empty($table)) {
            // $model = "App\Models\/$table";
            DB::table($table)->whereIn($key, $value)->update($update);
            return CF::sendResponse(1, 'Updated Successfully', $request->update);
        } else {
            return CF::sendResponse(0, 'Something went wrong.');
        }
    }
}
