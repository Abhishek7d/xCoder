<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Server extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "servers";
    protected $hidden = [
        'droplet_id', 'hashed', 'deleted_at'
    ];
    protected static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $model->uuid = (string) Str::slug('server ' . Self::rplace($model->name)  . ' ' . Str::uuid(), '-');
        });
    }
    private static function rplace($str)
    {
        $str = str_replace('servers', '', $str);
        $str = str_replace('server', '', $str);

        return $str;
    }
    public function applications()
    {
        return $this->hasMany('App\Models\Application', 'server_id');
    }
    public function storage()
    {
        return $this->hasOne("App\Models\Storage", "server_id");
    }
    public function project()
    {
        return $this->belongsTo('App\Models\Project');
    }
}
