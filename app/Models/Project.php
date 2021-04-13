<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use App\Models\User;

class Project extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $table = 'projects';
    // protected $appends = array();

    protected static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $model->uuid = (string) Str::slug('project ' . Self::rplace($model->name) . ' ' . Str::uuid(), '-');
        });
    }
    private static function rplace($str)
    {
        $str = str_replace('projects', '', $str);
        $str = str_replace('project', '', $str);
        return $str;
    }
    public function servers()
    {
        return $this->hasMany("App\Models\Server", "project_id");
    }
    public function droplets()
    {
        return $this->hasMany("App\Models\Server", "project_id")->withTrashed();
    }
    public function users()
    {
        $user = $this->belongsTo("App\Models\User", 'user_id');
        return $user;
    }
    public function applications()
    {
        return $this->hasMany("App\Models\Application", "project_id");
    }
    public function delegateUsers()
    {
        return $this->hasMany('App\Models\DelegateAccess', 'project_id')->with('details');
    }
}
