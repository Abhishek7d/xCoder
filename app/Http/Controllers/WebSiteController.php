<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ApplicationInstaller;
use App\Models\Server;
use App\Http\Controllers\helpers\CommonFunctions;
use App\Http\Controllers\helpers\CommonFunctions as CF;
use phpseclib\Crypt\RSA;
use phpseclib\Net\SSH2;
use App\Models\Application;
use App\Models\DelegateAccess;
use App\Models\User;
use App\Models\Project;

class WebSiteController extends Controller
{
    private $step_one = "cd /usr/local/vesta/bin/\n";
    private $wp_download_link = "https://wordpress.org/latest.zip";
    private $sample_wp_config = __DIR__ . "/helpers/wp-config.sample.txt";
    private $domainNameChangeSql = "update wp_options set option_value = 'NEW_VALUE' where option_value like '%OLD_VALUE%'";
    private $domainNameChangeSqlPrefix = 'mysql -u USER_NAME -D DATABASE_NAME -pPASSWORD -e "SQL"';

    private function is_valid_domain_name($domain_name)
    {
        return (preg_match("/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i", $domain_name)
            && preg_match("/^.{1,253}$/", $domain_name)
            && preg_match("/^[^\.]{1,63}(\.[^\.]{1,63})*$/", $domain_name));
    }

    public function removeDomain(Request $request, $application)
    {
        $application = Application::find($application);

        $user = CommonFunctions::userHasDelegateAccess($request->project_id);

        if (!$application) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if ($application->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $ssh->write($this->step_one);
        $ssh->write("./v-delete-domain admin $application->domain\n");
        $output = $ssh->read();
        $application->delete();
        return CommonFunctions::sendResponse(1, "Application Deleted Successfully", $output);
    }
    public function showDomains(Request $request, $all = false)
    {

        if ($request->project_id) {
            if (!Project::find(CF::projectId($request->project_id))) {
                return CommonFunctions::sendResponse(0, "Invalid Project");
            }
            $projectId  = CommonFunctions::projectId($request->project_id);
            $user = CommonFunctions::userHasDelegateAccess($request->project_id);

            // Find servers
            $servers = Server::where([['project_id', $projectId], ['user_id', $user->id]]);
            if (!$servers->exists()) {
                return CommonFunctions::sendResponse(0, "Please create or assign a server first.");
            }
            $ids = [];
            foreach ($servers->get() as $server) {
                $ids[] = $server->id;
            }
            $perPage = '';
            $apps = Application::where("user_id", $user->id)->whereIn('server_id', $ids);
            if ($all) {
                $perPage = $apps->count();
            }
            $apps = $apps->with('server')->paginate($perPage);
            // $apps = Application::where([['project_id', CF::projectId($request->project_id)], ["user_id", $user->id]])->with('server')->paginate();
            $msg = "Your applications";
            if ($user->delegateAccess != 'active') {
                $msg = "You do not have access to this project.";
            } else {
                if ($apps->count() == 0) {
                    $msg = "Please create a Application.";
                }
            }
            return CommonFunctions::sendResponse(1, $msg, $apps);
        } else {
            return CommonFunctions::sendResponse(0, "Please select a project first");
        }
    }
    public function addDomain(Request $request)
    {
        $domain = $request->get('domain');
        $project_id = $request->get('project_id');
        $server = $request->get('server');

        if (empty($project_id)) {
            return CommonFunctions::sendResponse(0, "Invalid Project");
        }
        $project_id = CF::projectId($request->get('project_id'));
        $server = CommonFunctions::getId($server, 'servers');
        if (empty($server) || empty($domain)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        $user = CommonFunctions::userHasDelegateAccess($request->project_id);
        $server = Server::find($server);
        if (!$server || $server->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource", $user);
        }
        $application = $this->createApplicationToServer($server, $domain, $user, $project_id);
        return CommonFunctions::sendResponse(1, "Domain added to the server", $application);
    }
    public function createApplicationToServer($server, $name, $user, $project_id)
    {
        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        $connection =  @socket_connect($socket, $server->ip_address, 22);
        if (!$connection || !$server->ip_address) {
            return CommonFunctions::sendResponse(0, "Server unreachable");
        }

        $ssh = CommonFunctions::connect($server->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        //move to command path
        $ssh->write($this->step_one);
        //add webiste
        $domain = CommonFunctions::generateRandomString(5) . strval($user->ID);
        $doamin = strtolower($domain);
        $domain_name = $domain . "." . env('DEFAULT_MASTER_DOMAIN');
        $domain_name = strtolower($domain_name);
        $ssh->write("./v-add-domain admin $domain_name $server->ip_address\n");
        //create Application
        $application = new Application();
        $application->name = $name;
        $application->ftp_credentials = json_encode([]);
        $application->domain = $domain_name;
        $application->server_id = $server->id;
        $application->ip_address = $server->ip_address;
        $application->user_id = $user->id;
        $application->ssl_enabled = 0;
        $application->project_id = $project_id;
        $application->status = CommonFunctions::$application_statuses[2];
        $application->save();
        CommonFunctions::releaseResponse(1, "Application Created Successfully", $application);
        set_time_limit(0);
        $install_wp = true;
        if ($install_wp) {
            //create database
            $db_password = CommonFunctions::generateRandomString(8);
            $password = CommonFunctions::generateRandomString(8);
            $db_name = $domain;
            // $ssh->write("./v-delete-database admin admin_$db_name\n");
            $ssh->write("./v-add-database admin $db_name $db_name $db_password mysql\n");

            // install wp cli
            $ssh->write("wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar\n");
            $ssh->write("chmod +x wp-cli.phar\n");
            $ssh->write("mv wp-cli.phar /usr/local/bin/wp\n");

            // install wp
            $ssh->write("cd /home/admin/web/$domain_name/public_html\n");
            $ssh->write("su admin\n");
            $ssh->write("wget " . $this->wp_download_link . "\n");
            $ssh->write("unzip latest.zip\n");
            $ssh->write("mv ./wordpress/* ./ && mv ./wordpress/.* ./ \n");
            $ssh->write("rm -rf latest.zip wordpress index.html robots.txt\n");
            $table_prefix = '$table_prefix';
            $config = file_get_contents($this->sample_wp_config);
            $config = str_replace("VESTA_DB_NAME", "admin_$db_name", $config);
            $config = str_replace("VESTA_DB_USER", "admin_$db_name", $config);
            $config = str_replace("VESTA_DB_PASSWORD", $db_password, $config);
            $ssh->write("$config\n");

            // Install Wordpress DB
            $ssh->write("wp core install --url=http://$domain_name --title=WordPress --admin_user=admin --admin_password=$password --admin_email=$user->email" . "\n");
            $application->db_name = "admin_$domain";
            $application->db_username = "admin_$domain";
            $application->db_password = $db_password;
            $application->username = 'admin';
            $application->password = $password;
        }
        $application->save();
        $output2 = $ssh->read();

        $ssh2 = new SSH2("parvaty.me");
        $output = null;
        if ($ssh2->login('root', "Dibyendu#1")) {
            $ssh2->write($this->step_one);
            $ssh2->write("./v-add-dns-record admin parvaty.me $domain A $server->ip_address\n");
            $ssh2->write("./v-add-dns-record admin parvaty.me www.$domain A $server->ip_address\n");
            $ssh->write("./v-add-letsencrypt-domain admin $domain");
            $output = $ssh2->read();
        }
        return [$application, $output];
    }
    public function updateDomainName(Request $request, $application)
    {
        $application = Application::find($application);

        $user = CommonFunctions::userHasDelegateAccess($request->project_id);

        if (!$application) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if ($application->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }
        $new_domain = $request->get('domain');
        if (!$this->is_valid_domain_name($new_domain)) {
            return CommonFunctions::sendResponse(0, "Invalid Domain name");
        }
        $ssh->write($this->step_one);
        $ssh->write("./v-change-web-domain-name admin $application->domain $new_domain\n");
        $ssh->write("./v-add-web-domain-alias admin $new_domain www.$new_domain\n");

        $domainName = "http://" . $new_domain;
        $sql_data = $this->updateDBScript($application, $domainName);
        $ssh->write("$sql_data\n");

        $application->domain = $new_domain;
        $application->ssl_enabled = 0;
        $application->save();
        $output = $ssh->read();
        return CommonFunctions::sendResponse(1, "Domain name changed Successfully");
    }

    public function updateDBScript($application, $domainName)
    {
        $sql_data = $this->domainNameChangeSql;
        $sql_data = str_replace("OLD_VALUE", $application->domain, $sql_data);
        $sql_data = str_replace("NEW_VALUE", $domainName, $sql_data);
        $sql_data = str_replace('SQL', $sql_data, $this->domainNameChangeSqlPrefix);
        $sql_data = str_replace('DATABASE_NAME', $application->db_name, $sql_data);
        $sql_data = str_replace('USER_NAME', $application->db_username, $sql_data);
        $sql_data = str_replace('PASSWORD', $application->db_password, $sql_data);
        return $sql_data;
    }

    public function addSSLToDomain(Request $request, $application)
    {
        $application = Application::find($application);

        $user = CommonFunctions::userHasDelegateAccess($request->project_id);

        if (!$application) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if ($application->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        $ip_addr = gethostbyname($application->domain);
        $alise_ip_addr = gethostbyname("www." . $application->domain);

        if ($ip_addr != $application->ip_address || $alise_ip_addr != $application->ip_address) {
            return CommonFunctions::sendResponse(0, "please add two A record with $application->domain and www.$application->domain to $application->ip_address");
        }

        $ssh->write($this->step_one);
        $ssh->write("./v-add-letsencrypt-domain admin $application->domain\n");

        $domainName = "https://" . $application->domain;
        $sql_data = $this->updateDBScript($application, $domainName);
        $ssh->write("$sql_data\n");

        $application->ssl_enabled = 1;
        $application->save();
        $output = $ssh->read();
        return CommonFunctions::sendResponse(1, "SSL added to Domain Successfully", $output);
    }
    public function removeSSLToDomain(Request $request, $application)
    {
        $application = Application::find($application);

        $user = CommonFunctions::userHasDelegateAccess($request->project_id);

        if (!$application) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if ($application->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        $ssh->write($this->step_one);
        $ssh->write("./v-delete-letsencrypt-domain admin $application->domain\n");

        $domainName = "http://" . $application->domain;
        $sql_data = $this->updateDBScript($application, $domainName);
        $ssh->write("$sql_data\n");

        $application->ssl_enabled = 0;
        $application->save();
        $output = $ssh->read();
        return CommonFunctions::sendResponse(1, "SSL removed from Domain Successfully");
    }
    public function addFTPToApplication(Request $request, $application)
    {
        $username = $request->get("username");
        $password = $request->get("password");

        $user = CommonFunctions::userHasDelegateAccess($request->project_id);

        if (empty($username) || empty($password)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        if (strlen($username) < 6 || strlen($password) < 6) {
            return CommonFunctions::sendResponse(0, "minimum lengh 6");
        }
        $application = Application::find($application);
        if (!$application) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if ($application->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        $ssh->write($this->step_one);
        $ssh->write("./v-add-web-domain-ftp admin $application->domain $username $password '/public_html'\n");

        $ftp_credentials = json_decode($application->ftp_credentials);
        $ftp = ['host' => $application->ip_address, 'username' => "admin_" . $username, "password" => $password];
        if (!$ftp_credentials) {
            $ftp_credentials = [];
        }
        array_push($ftp_credentials, $ftp);
        $application->ftp_credentials = json_encode($ftp_credentials);

        $application->save();
        $output = $ssh->read();
        return CommonFunctions::sendResponse(1, "FTP user added to Domain Successfully");
    }
    public function removeFTPToApplication(Request $request, $application)
    {
        $username = $request->get("username");

        $user = CommonFunctions::userHasDelegateAccess($request->project_id);

        if (empty($username)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        $application = Application::find($application);
        if (!$application) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if ($application->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        $ssh->write($this->step_one);
        $ssh->write("./v-delete-web-domain-ftp admin $application->domain $username\n");

        $ftp_credentials = json_decode($application->ftp_credentials);
        if (!$ftp_credentials) {
            $ftp_credentials = [];
        }
        foreach ($ftp_credentials as $key => $ftp) {
            if ($ftp->username == $username) {
                unset($ftp_credentials[$key]);
            }
        }
        $application->ftp_credentials = json_encode(array_values($ftp_credentials));

        $application->save();
        $output = $ssh->read();
        return CommonFunctions::sendResponse(1, "FTP removed from Domain Successfully");
    }
    public function changeFTPPassword(Request $request, $application)
    {
        $username = $request->get("username");
        $password = $request->get("password");

        $user = CommonFunctions::userHasDelegateAccess($request->project_id);

        if (empty($username) || empty($password)) {
            return CommonFunctions::sendResponse(0, "All Fields are required");
        }
        if (strlen($username) < 6 || strlen($password) < 6) {
            return CommonFunctions::sendResponse(0, "minimum lengh 6");
        }

        $application = Application::find($application);
        if (!$application) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        if ($application->user_id != $user->id) {
            return CommonFunctions::sendResponse(0, "You have not access to this resource");
        }
        $ssh = CommonFunctions::connect($application->ip_address);
        if (!$ssh) {
            return CommonFunctions::sendResponse(0, "Server Auth Faild");
        }

        $ssh->write($this->step_one);
        $ssh->write("./v-change-web-domain-ftp-password admin $application->domain $username $password\n");

        $ftp_credentials = json_decode($application->ftp_credentials);
        if (!$ftp_credentials) {
            $ftp_credentials = [];
        }
        foreach ($ftp_credentials as $key => $ftp) {
            if ($ftp->username == $username) {
                $ftp_credentials[$key]->password = $password;
            }
        }
        $application->ftp_credentials = json_encode(array_values($ftp_credentials));
        $application->save();
        $output = $ssh->read();
        return CommonFunctions::sendResponse(1, "FTP removed from Domain Successfully");
    }
}
