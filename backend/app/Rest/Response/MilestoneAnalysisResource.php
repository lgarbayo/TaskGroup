<?php

namespace App\Rest\Response;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MilestoneAnalysisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'milestoneUuid' => $this->milestoneUuid,
            'milestoneTitle' => $this->milestoneTitle,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'initialCompletion' => $this->initialCompletion,
            'endCompletion' => $this->endCompletion,
            'taskList' => TaskAnalysisResource::collection($this->taskList),
        ];
    }
}
