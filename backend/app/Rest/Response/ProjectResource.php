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
                'year' => $this->startYear,
                'month' => $this->startMonth,
                'week' => $this->startWeek,
            ],
            'endDate' => [
                'year' => $this->endYear,
                'month' => $this->endMonth,
                'week' => $this->endWeek,
            ],
            'additionalFields' => $this->additionalFields ?? [],
            'ownerId' => $this->ownerId,
            'members' => $this->members,
            'tasks' => TaskResource::collection($this->tasks),
            'milestones' => MilestoneResource::collection($this->milestones),
            'tasks_count' => $this->tasks ? count($this->tasks) : null,
        ];
    }
}
