<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 


class Application extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $table = 'applications';
    protected $hidden = [
        'user_id','ip_address','deleted_at'
    ];
    public function server(){
        return $this->belongsTo("App\Models\Server", "server_id");
    }
}
