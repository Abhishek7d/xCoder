<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Application extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $table = 'applications';
    protected $hidden = [
        'user_id', 'ip_address', 'deleted_at'
    ];
    protected static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $model->uuid = (string) Str::slug('application ' . Self::rplace($model->name)  . ' ' . Str::uuid(), '-');
        });
    }
    private static function rplace($str)
    {
        $str = str_replace('applications', '', $str);
        $str = str_replace('application', '', $str);

        return $str;
    }
    public function server()
    {
        return $this->belongsTo("App\Models\Server", "server_id");
    }
}
