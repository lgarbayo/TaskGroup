<?php

namespace App\Rest\Controller;

use App\Business\Project\Service\ProjectService;
use App\Http\Controllers\Controller;
use App\Rest\Response\ProjectResource;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ProjectInvitationController extends Controller
{
    public function __construct(private ProjectService $projects)
    {
    }

    public function accept(Request $request, string $token)
    {
        try {
            $project = $this->projects->acceptInvitation($token, $request->user()->id);
        } catch (DomainException $exception) {
            throw new HttpException(Response::HTTP_CONFLICT, $exception->getMessage());
        }

        return (new ProjectResource($project))->response();
    }
}
