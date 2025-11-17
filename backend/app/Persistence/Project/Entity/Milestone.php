<?php

namespace App\Persistence\Project\Entity;

use App\Persistence\Project\Entity\Project;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Milestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'uuid',
        'title',
        'description',
        'date_year',
        'date_month',
        'date_week',
    ];

    protected static function booted()
    {
        static::creating(function (Milestone $milestone) {
            $milestone->uuid = $milestone->uuid ?? (string) Str::uuid();
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
