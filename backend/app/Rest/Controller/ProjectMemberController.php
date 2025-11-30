<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Project\AddMemberRequest;
use App\Business\Project\Service\ProjectService;
use App\Persistence\User\Entity\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\Response;

class ProjectMemberController extends Controller
{

    public function __construct(private ProjectService $projects)
    {
    }

    public function store(AddMemberRequest $request, string $projectId)
    {
        $project = $this->projects->findForUser($projectId, $request->user()->id, ownerOnly: true);
        $data = $request->validated();

        $user = User::where('email', $data['email'])->firstOrFail();

        $alreadyMember = $project->members()->where('user_id', $user->id)->exists();

        if ($alreadyMember) {
            throw new HttpException(409, 'El usuario ya pertenece al proyecto.');
        }

        $project->members()->attach($user->id, ['role' => $data['role'] ?? 'member']);

        $project = $project->fresh(['members']);

        return (new \App\Rest\Response\ProjectResource($project))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
