<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Models\Server;
use App\Models\Application;
use phpseclib\Net\SSH2;

class ApplicationInstaller implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Server $server, Application $application, SSH2 $ssh)
    {
        $this->server = $server;
        $this->application = $application;
        $this->ssh = $ssh;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // v-add-database
    }
}
