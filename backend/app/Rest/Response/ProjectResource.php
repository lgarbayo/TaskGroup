<?php

namespace App\Rest\Response;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Rest\Response\TaskResource;
use App\Rest\Response\MilestoneResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'startDate' => [
                'year' => $this->start_year,
                'month' => $this->start_month,
                'week' => $this->start_week,
            ],
            'endDate' => [
                'year' => $this->end_year,
                'month' => $this->end_month,
                'week' => $this->end_week,
            ],
            'additionalFields' => $this->additional_fields ?? [],
            'owner' => $this->when(isset($this->owner), function () {
                return [
                    'id' => $this->owner->id,
                    'alias' => $this->owner->alias,
                    'email' => $this->owner->email,
                ];
            }),
            'members' => $this->whenLoaded('members', fn () => $this->members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'alias' => $member->alias,
                    'email' => $member->email,
                    'role' => $member->pivot->role ?? 'member',
                ];
            })->values()),
            'tasks' => $this->whenLoaded('tasks', fn () => TaskResource::collection($this->tasks)),
            'milestones' => $this->whenLoaded('milestones', fn () => MilestoneResource::collection($this->milestones)),
            'tasks_count' => $this->when(isset($this->tasks_count), $this->tasks_count),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
