<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 

class Server extends Model{
    use HasFactory;
    use SoftDeletes;

    protected $table = "servers";
    protected $hidden = [
        'droplet_id','hashed','deleted_at'
    ];
}
