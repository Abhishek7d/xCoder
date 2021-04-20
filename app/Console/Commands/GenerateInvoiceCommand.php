<?php

namespace App\Console\Commands;

use App\Http\Controllers\admin\droplet\InvoiceController;
use Illuminate\Console\Command;

class GenerateInvoiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoice:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Invoices';

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
        // 
        $invoice = new InvoiceController();
        $invoice->generateInvoice(date('Y-m'));
    }
}
