<?php

namespace App\Console\Commands;

use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\Invoices;
use App\Models\SavedCards;
use App\Models\User;
use Illuminate\Console\Command;

class ChargeInvoiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoice:charge';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Charge Invoice';

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
        // $status = CommonFunctions::getClientStatus(8);
        // $this->info('status ' . $status);
        $invoices = Invoices::where('status', '!=', 'paid')->get();
        foreach ($invoices as $invoice) {
            $card = SavedCards::where('user_id', $invoice->user_id);
            if ($card->exists()) {
                CommonFunctions::chargeCard($invoice);
            } else {
                $user = User::find($invoice->user_id);
                $user->status = 'overdue';
                $user->save();
            }
        }
        return 0;
    }
}
