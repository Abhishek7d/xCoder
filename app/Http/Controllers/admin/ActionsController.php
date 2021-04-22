<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\helpers\CommonFunctions as CF;
use App\Models\Options;
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
            foreach ($update as $col => $ups) {
                if (in_array($col, ['password', 'email_verified_at', 'remember_token', 'access_token'])) {
                    return CF::sendResponse(0, 'Action Unauthorized');
                }
            }
            // $model = "App\Models\/$table";
            $re = DB::table($table)->whereIn($key, $value)->update($update);
            return CF::sendResponse(1, 'Updated Successfully', $re);
        } else {
            return CF::sendResponse(0, 'Something went wrong.');
        }
    }

    public function setSetting(Request $request)
    {
        $json = $request->json;
        $option = $request->option;
        $value = ($json) ? json_encode($request->value) : $request->value;
        if (!empty($option) && !empty($value)) {
            $options = Options::where('option', $option);
            if ($options->exists()) {
                $options = $options->first();
                $options->value = $value;
                $options->save();
                return CF::sendResponse(1, 'Updated Successfully');
            } else {
                $op = new Options();
                $op->value = $value;
                $op->option = $option;
                $op->save();
                return CF::sendResponse(1, 'Saved Successfully');
            }
        } else {
            return CF::sendResponse(0, 'Something went wrong.');
        }
    }

    public function getSetting($option, $json = 0)
    {
        $options = Options::where('option', $option)->select(['value']);
        if ($options->exists()) {
            if ($json == 'json') {
                $options = json_decode($options->first()->value);
            }
            return CF::sendResponse(1, 'Settings', $options);
        } else {
            return CF::sendResponse(0, 'Something went wrong.');
        }
    }
}
