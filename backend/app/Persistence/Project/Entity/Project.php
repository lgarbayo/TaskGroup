<?php

namespace App\Persistence\Project\Entity;

use App\Persistence\User\Entity\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function invitations(): HasMany
    {
        return $this->hasMany(ProjectInvitation::class);
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
