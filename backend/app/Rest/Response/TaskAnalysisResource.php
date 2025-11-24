<?php

namespace App\Rest\Response;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskAnalysisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'taskUuid' => $this->taskUuid,
            'taskTitle' => $this->taskTitle,
            'initialCompletion' => $this->initialCompletion,
            'endCompletion' => $this->endCompletion,
        ];
    }
}
