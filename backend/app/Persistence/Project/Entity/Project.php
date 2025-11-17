<?php

namespace App\Persistence\Project\Entity;

use App\Persistence\User\Entity\User;
use App\Persistence\Project\Entity\Task;
use App\Persistence\Project\Entity\Milestone;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'uuid',
        'title',
        'description',
        'start_year',
        'start_month',
        'start_week',
        'end_year',
        'end_month',
        'end_week',
        'additional_fields',
    ];

    protected $casts = [
        'additional_fields' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function (Project $project) {
            $project->uuid = $project->uuid ?? (string) Str::uuid();
        });
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class)->withTimestamps()->withPivot('role');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
