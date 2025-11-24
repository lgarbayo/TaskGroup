<?php

namespace App\Rest\Response;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectAnalysisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'project' => new ProjectResource($this->project),
            'milestoneList' => MilestoneAnalysisResource::collection($this->milestoneList),
        ];
    }
}
