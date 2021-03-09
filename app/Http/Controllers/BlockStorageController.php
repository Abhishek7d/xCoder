<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\Storage;
use App\Models\Server;
use App\Models\StorageChanges;

class BlockStorageController extends Controller
{
    public function createBlockStorage(Request $request)
    {
        $size = $request->get("size");
        $server = $request->get("server");
        if (empty($server) || empty($size)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        if ($size < 1) {
            return CommonFunctions::sendResponse(0, "Minimum limit 1GB");
        }
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $storage = Storage::where("server_id", $server->id)->get();
        if (count($storage) > 0) {
            return CommonFunctions::sendResponse(0, "Storage device already attached");
        }
        $body = [
            "size_gigabytes" => (int) $size,
            "name" => "server-$server->id",
            "description" => "server-$server->id",
            "region" => $server->region,
            "filesystem_type" => "ext4",
            "filesystem_label" => "server-$server->id"
        ];

        // die;
        $block = CommonFunctions::makeRequest("/volumes", "POST", json_encode($body));

        if ($block['status'] == false) {
            return CommonFunctions::sendResponse(0, "Error creating Block Storage", $block);
        }
        $block = json_decode($block['data']);
        if (isset($block->id)) {
            return CommonFunctions::sendResponse(0, $block->message);
        }

        if (!$block->volume) {
            return CommonFunctions::sendResponse(0, "Error creating Block Storage", $block);
        }
        $storage = new Storage();
        $storage->storage_id = $block->volume->id;
        $storage->name = "SERVER:$server->id";
        $storage->region = $server->region;
        $storage->server_id = $server->id;
        $storage->size = $size;
        $storage->save();
        $changes = new StorageChanges();
        $changes->storage_id = $storage->id;
        $changes->size = $size;
        $changes->save();
        $body = [
            "type" => "attach",
            "droplet_id" => $server->droplet_id,
            "region" => $server->region,
            "tags" => [
                "SERVER:$server->id"
            ]
        ];
        $response = CommonFunctions::makeRequest("/volumes/$storage->storage_id/actions", "POST", json_encode($body));
        return CommonFunctions::sendResponse(1, "Block Storage Attached");
    }

    public function resizeBlockStorage(Request $request)
    {
        $size = $request->get("size");
        $server = $request->get("server");
        if (empty($server) || empty($size)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        if ($size < 1) {
            return CommonFunctions::sendResponse(0, "Minimum limit 1GB");
        }
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $storage = Storage::where("server_id", $server->id)->get();
        if (count($storage) < 1) {
            return CommonFunctions::sendResponse(0, "No storage attached to this resource");
        }
        $storage = $storage[0];
        $body = [
            "type" => "resize",
            "size_gigabytes" => (int)$size,
            "region" => $storage->region
        ];
        // echo json_encode($body);
        // die($storage->storage_id);
        // die;
        $block = CommonFunctions::makeRequest("/volumes/$storage->storage_id/actions", "POST", json_encode($body));

        if ($block['status'] == false) {
            return CommonFunctions::sendResponse(0, "Error resizing storage", $block);
        }
        $block = json_decode($block['data']);
        if (isset($block->id)) {
            return CommonFunctions::sendResponse(0, $block->message);
        }
        $storage->size = $size;
        $storage->save();
        $changes = new StorageChanges();
        $changes->storage_id = $storage->id;
        $changes->size = $size;
        $changes->save();
        return CommonFunctions::sendResponse(1, "Block Storage Resized successfully");
    }
    public function deleteBlockStorage(Request $request)
    {
        $server = $request->get("server");
        if (empty($server)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $storage = Storage::where("server_id", $server->id)->get();
        if (count($storage) < 1) {
            return CommonFunctions::sendResponse(0, "No storage attached to this resource");
        }
        $storage = $storage[0];

        $body = [
            "type" => "detach",
            "droplet_id" => $server->droplet_id,
            "region" => $storage->region
        ];
        // echo json_encode($body);
        // die;
        $block = CommonFunctions::makeRequest("/volumes/$storage->storage_id/actions", "POST", json_encode($body));

        if ($block['status'] == false) {
            return CommonFunctions::sendResponse(0, "Error detaching storage", $block);
        }
        $block = json_decode($block['data']);
        if (isset($block->id)) {
            return CommonFunctions::sendResponse(0, $block->message);
        }

        $block = CommonFunctions::makeRequest("/volumes/$storage->storage_id", "DELETE");

        $storage->delete();
        return CommonFunctions::sendResponse(1, "Block Storage Deleted successfully", $block);
    }
}
