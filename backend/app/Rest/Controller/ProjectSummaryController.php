<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Response\ProjectSummaryResource;
use App\Business\Project\Facade\ProjectFacade;
use Illuminate\Http\Request;

class ProjectSummaryController extends Controller
{

    public function __construct(private ProjectFacade $facade)
    {
    }

    public function show(Request $request, string $projectId)
    {
        $summary = $this->facade->projectSummary($projectId, $request->user()->id);

        return new ProjectSummaryResource($summary);
    }
}
