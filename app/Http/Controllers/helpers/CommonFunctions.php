<?php

namespace App\Http\Controllers\helpers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CommonFunctions extends Controller
{
    public static $availableSizes = ["s-1vcpu-1gb","512mb","s-1vcpu-2gb","1gb","s-3vcpu-1gb","s-2vcpu-2gb","s-1vcpu-3gb","s-2vcpu-4gb","2gb","s-4vcpu-8gb","m-1vcpu-8gb","c-2","4gb","c2-2vcpu-4gb","g-2vcpu-8gb","gd-2vcpu-8gb","m-16gb","s-8vcpu-16gb","s-6vcpu-16gb","c-4","8gb","c2-4vpcu-8gb","m-2vcpu-16gb","m3-2vcpu-16gb","g-4vcpu-16gb","gd-4vcpu-16gb","m6-2vcpu-16gb","m-32gb","s-8vcpu-32gb","c-8","c2-8vpcu-16gb","m-4vcpu-32gb","m3-4vcpu-32gb","g-8vcpu-32gb","s-12vcpu-48gb","gd-8vcpu-32gb","m6-4vcpu-32gb","m-64gb","s-16vcpu-64gb","c-16","32gb","c2-16vcpu-32gb","m-8vcpu-64gb","m3-8vcpu-64gb","g-16vcpu-64gb","s-20vcpu-96gb","48gb","gd-16vcpu-64gb","m6-8vcpu-64gb","m-128gb","s-24vcpu-128gb","c-32","64gb","c2-32vpcu-64gb","s-32vcpu-192gb"];
    public static $server_statuses = ['BLANK', "NOT READY",'INSTALLING', "READY", "FAILD"];
    public static function releaseResponse($status=0,$message="", $data=null){
        ignore_user_abort(true);
        set_time_limit(0);
        ob_start();
        echo json_encode(array('status'=>$status, 'message'=>$message, 'data'=>$data));
        header('Content-Type: application/json');
        header('Connection: close');
        header('Content-Length: '.ob_get_length());
        ob_end_flush();
        ob_flush();
        flush();
    }
    public static function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    public static function sendResponse($status=0, $message="", $data=null){
        $data = json_encode(array('status'=>$status, 'message'=>$message, 'data'=>$data));
        return response($data)->header('Content-Type', 'application/json');
    }
    public static function validateSize($size){
        if (($key = array_search($size, CommonFunctions::$availableSizes)) !== false) {
            return true;
        }else{
            return false;
        }
    }
    public static function makeRequest($url, $type="GET", $body=null, $headers=null){
        $curl_options=array(
            CURLOPT_URL => env("DO_API_ENDPOINT").$url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $type,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "Authorization: Bearer ".env('DO_API_TOKEN'),
            ),            
        );
        if($body!=null){
            $curl_options[CURLOPT_POSTFIELDS] = $body;
        }
        if($headers!=null){
            if(is_array($headers)){
                foreach($headers as $header){
                    array_push($curl_options[CURLOPT_HTTPHEADER],$header);
                }
            }else{
                array_push($curl_options[CURLOPT_HTTPHEADER],$headers);
            }
        }
        $curl = curl_init();
        curl_setopt_array($curl, $curl_options);
        $response = curl_exec($curl);
        $status = true;
        if(!$response){
            $response = curl_error($curl);
            $status= false;
        }
        curl_close($curl);
        return ['status'=>$status, 'data'=>$response];
    }
}
