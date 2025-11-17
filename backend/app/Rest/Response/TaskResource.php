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
            'projectUuid' => $this->project->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'durationWeeks' => $this->duration_weeks,
            'startDate' => [
                'year' => $this->start_year,
                'month' => $this->start_month,
                'week' => $this->start_week,
            ],
            'assignee' => $this->when($this->assignee, function () {
                return [
                    'id' => $this->assignee->id,
                    'alias' => $this->assignee->alias,
                    'email' => $this->assignee->email,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
