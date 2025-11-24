<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Business\Facade\ProjectFacade;
use App\Rest\Response\ProjectAnalysisResource;
use Illuminate\Http\Request;

class AnalysisController extends Controller
{
    public function __construct(private ProjectFacade $facade)
    {
    }

    public function show(Request $request, string $project)
    {
        $analysis = $this->facade->projectAnalysis($project, $request->user()->id);

        return new ProjectAnalysisResource($analysis);
    }
}
