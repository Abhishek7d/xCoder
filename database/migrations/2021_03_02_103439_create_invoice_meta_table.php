<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoiceMetaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("invoice_id")->unsigned();
            $table->string('item');
            $table->string('description');
            $table->float("total", 8, 4);
            $table->string('currency');
            $table->text('days');
            $table->text('hours');
            $table->float('hourly_rate', 8, 6);
            $table->string('cost_type');
            $table->softDeletes();
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
        Schema::dropIfExists('invoice_meta');
    }
}
