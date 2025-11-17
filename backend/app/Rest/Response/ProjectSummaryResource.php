<?php

namespace App\Rest\Response;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Rest\Response\ProjectResource;
use App\Rest\Response\MilestoneResource;
use App\Rest\Response\TaskResource;

class ProjectSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'project' => new ProjectResource($this['project']),
            'totals' => $this['totals'],
            'milestones' => MilestoneResource::collection($this['milestones']),
            'tasks' => TaskResource::collection($this['tasks']),
        ];
    }
}
