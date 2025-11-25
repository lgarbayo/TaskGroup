<?php

namespace App\Rest\Response;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'projectUuid' => $this->projectUuid,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'durationWeeks' => $this->durationWeeks,
            'startDate' => [
                'year' => $this->startYear,
                'month' => $this->startMonth,
                'week' => $this->startWeek,
            ],
            'assignee' => $this->assignee,
            'milestone' => $this->milestone,
        ];
    }
}
