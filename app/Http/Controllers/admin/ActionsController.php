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
        if (isset($selected_ids) && count($selected_ids) > 0 && !empty($table)) {
            // $model = "App\Models\/$table";
            DB::table($table)->whereIn('id', $selected_ids)->update(['deleted_at' => Carbon::now()]);
            return CF::sendResponse(1, 'Deleted Successfully', $request->input());
        } else {
            return CF::sendResponse(0, 'Something went wrong.');
        }
    }
}
