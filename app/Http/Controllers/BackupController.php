<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Server;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\Application;
use Illuminate\Support\Facades\Validator;

class BackupController extends Controller
{
    private function filterDisplayData($data)
    {
        $data = explode("\n", $data);
        $data = array_slice($data, 2);
        array_pop($data);
        $data = implode("\n", $data);
        $data = preg_replace("!\r?\n!", "", $data);
        return $data;
    }
    private function getDomainDetail($domain)
    {
        return Application::where('domain', $domain)->first();
    }
    public function getAllBackups($server)
    {
        $server = Server::find($server);
        $application = Application::where('server_id', $server->id)->get();

        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $data = $ssh->exec('pwd');
        $ssh->write("cd /usr/local/vesta/bin/\n");
        $ssh->write("v-list-user-backups admin json\n");
        $data = $ssh->read();
        $data = $this->filterDisplayData($data);
        $data = explode("v-list-user-backups admin json", $data);
        $data = array_pop($data);
        $data = json_decode($data);
        $backups = [];
        $i = 0;
        foreach ($data as $key => $bkps) {
            $web = explode(",", $bkps->WEB);
            foreach ($web as $domain) {
                if ($this->getDomainDetail($domain) !== null) {
                    $backups[$domain] = $this->getBackupDetails($data, $this->getDomainDetail($domain))[$domain];
                }
            }
            $i++;
        }
        $domains = [];
        foreach ($application as $app) {
            if (isset($backups[$app->domain])) {
                $domains[] = array_reverse($backups[$app->domain]);
            }
        }
        return CommonFunctions::sendResponse(1, "List of Backups", $domains);
    }
    public function getBackups($server, $application)
    {
        $server = Server::find($server);

        $application = Application::find($application);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $data = $ssh->exec('pwd');
        $ssh->write("cd /usr/local/vesta/bin/\n");
        $ssh->write("v-list-user-backups admin json\n");
        $data = $ssh->read();
        $data = $this->filterDisplayData($data);
        $data = explode("v-list-user-backups admin json", $data);
        $data = array_pop($data);
        $data = json_decode($data);
        $backups = [];
        if (count($this->getBackupDetails($data, $application)) > 0) {
            $backups[$application->domain] = array_reverse($this->getBackupDetails($data, $application)[$application->domain]);
        } else {
            $backups[$application->domain] = [];
        }
        return CommonFunctions::sendResponse(1, "List of Backups", $backups);
    }
    private function getBackupDetails($data, $application)
    {
        $backups = [];
        $domain = $application->domain;
        $i = 0;
        foreach ($data as $key => $bkps) {
            $web = explode(",", $bkps->WEB);
            $dbs = explode(",", $bkps->DB);
            $mails = explode(",", $bkps->MAIL);
            $dns = explode(",", $bkps->DNS);
            $backups[$domain][$i]['web'] = null;
            $backups[$domain][$i]['db'] = null;
            $backups[$domain][$i]['dns'] = null;
            $backups[$domain][$i]['mail'] = null;
            $backups[$domain][$i]['date'] = $bkps->DATE;
            $backups[$domain][$i]['time'] = $bkps->TIME;
            $backups[$domain][$i]['size'] = $bkps->SIZE;
            $backups[$domain][$i]['type'] = $bkps->TYPE;
            $backups[$domain][$i]['name'] = $key;
            $backups[$domain][$i]['domain'] = $domain;
            foreach ($dbs as $db) {
                if ($application->db_name == $db) {
                    $backups[$domain][$i]['db'] = true;
                    $backups[$domain][$i]['db_name'] = $application->db_name;
                }
            }
            foreach ($mails as $mail) {
                if ($domain == $mail) {
                    $backups[$domain][$i]['mail'] = true;
                }
            }
            foreach ($dns as $dns) {
                if ($domain == $dns) {
                    $backups[$domain][$i]['dns'] = true;
                }
            }
            foreach ($web as $domains) {
                if ($domain == $domains) {
                    $backups[$domain][$i]['web'] = true;
                }
            }
            $i++;
        }
        return $backups;
    }
    // info: restore user
    // options: USER BACKUP [WEB] [DNS] [MAIL] [DB] [CRON] [UDIR] [NOTIFY]
    // Example : v-restore-user  'temp' 'temp.2019-08-16_05-16-47.tar' 'no' 'no' 'no' 'temp_booking' 'no' 'no' 'yes'
    public function restoreBackup(Request $request, $server)
    {
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $name = $request->get('name');
        $web = ($request->web) ? $request->web : 'no';
        $dns = ($request->dns) ? $request->dns : 'no';
        $mail = ($request->mail) ? $request->mail : 'no';
        $db = ($request->db) ? $request->db : 'no';
        $cron = ($request->cron) ? $request->cron : 'no';
        $udir = ($request->udir) ? $request->udir : 'no';
        $notify = ($request->notify) ? $request->notify : 'no';
        if (empty($name)) {
            return CommonFunctions::sendResponse(0, "Backup not found");
        }
        $cmd = "v-restore-user 'admin' '$name' '$web' '$dns' '$mail' '$db' '$cron' '$udir' '$notify'";
        $data = $ssh->exec('pwd');
        $ssh->write("cd /usr/local/vesta/bin/\n");
        $ssh->write("$cmd\n");
        $data = $ssh->read();
        $data = $this->filterDisplayData(trim($data));
        $data = explode('--', $data);
        $err = explode('Error:', $data[0]);
        if (isset($err[1])) {
            return CommonFunctions::sendResponse(0, "Backup not found");
        }
        $return = [];
        foreach ($data as $d) {
            if (!empty($d)) {
                $return[] = trim($d);
            }
        }
        return CommonFunctions::sendResponse(1, "Backup restored successfully", $return);
    }
    public function createBackup($server)
    {
        $server = Server::find($server);
        if (!$server) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if (!$server->user_id == auth()->user()->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        $data = $ssh->exec('pwd');
        $ssh->write("cd /usr/local/vesta/bin/\n");
        $ssh->write("v-backup-users\n");
        $data = $ssh->read();
        $data = $this->filterDisplayData(trim($data));

        return CommonFunctions::sendResponse(1, "Process started successfully, backup will be available soon.", $data);
    }
}
