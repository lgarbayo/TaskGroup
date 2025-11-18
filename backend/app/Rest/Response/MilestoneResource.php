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
            'projectUuid' => $this->projectUuid,
            'title' => $this->title,
            'description' => $this->description,
            'date' => [
                'year' => $this->dateYear,
                'month' => $this->dateMonth,
                'week' => $this->dateWeek,
            ],
        ];
    }
}
