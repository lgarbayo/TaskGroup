<?php

namespace App\Persistence\Project\Entity;

use App\Persistence\Project\Entity\Project;
use App\Persistence\User\Entity\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'milestone_uuid',
        'assignee_id',
        'uuid',
        'title',
        'description',
        'start_year',
        'start_month',
        'start_week',
        'duration_weeks',
        'status',
    ];

    protected static function booted()
    {
        static::creating(function (Task $task) {
            $task->uuid = $task->uuid ?? (string) Str::uuid();
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function milestone()
    {
        return $this->belongsTo(Milestone::class, 'milestone_uuid', 'uuid');
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
