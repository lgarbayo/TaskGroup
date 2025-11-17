<?php

namespace App\Rest\Response;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MilestoneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'projectUuid' => $this->project->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'date' => [
                'year' => $this->date_year,
                'month' => $this->date_month,
                'week' => $this->date_week,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
