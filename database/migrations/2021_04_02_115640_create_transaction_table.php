<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id()->startingValue(202101);
            $table->string('amount');
            $table->string('currency');
            $table->string('invoice_id')->nullable();
            $table->string('card');
            $table->string('user_id');
            $table->string('low_profile_code');
            $table->string('description')->nullable();
            $table->string('internal_deal_number')->nullable();
            $table->string('approval_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transaction');
    }
}
