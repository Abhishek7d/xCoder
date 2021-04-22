<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoices extends Model
{
    use HasFactory;


    public function items()
    {
        return $this->hasMany("App\Models\InvoiceItems", 'invoice_id');
    }
}
