<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class DelegateAccess extends Model
{
    use HasFactory, Notifiable;
    protected $table = "delegate_access";

    protected $appends = ['ago'];
    public function details()
    {
        return $this->belongsTo('App\Models\User', '_delegate_user_id')->select(['name', 'email', 'id']);
    }
    public function project()
    {
        return $this->belongsTo('App\Models\Project', 'project_id');
    }
    public function getAgoAttribute()
    {
        return \Carbon\Carbon::parse($this->last_active)->diffForHumans();
    }
}
