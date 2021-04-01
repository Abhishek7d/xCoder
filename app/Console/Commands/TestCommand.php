<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'parvaty:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is a test Command';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Task Run Successful at - ' . date('Y-m-d h:i:s'));
        Log::info('Task Run Successful at - ' . date('Y-m-d h:i:s'));
    }
}
