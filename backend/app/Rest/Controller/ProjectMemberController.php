<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Project\AddMemberRequest;
use App\Business\Project\Service\ProjectService;
use App\Persistence\User\Entity\User;
use App\Rest\Response\ProjectResource;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ProjectMemberController extends Controller
{

    public function __construct(private ProjectService $projects)
    {
    }

    public function store(AddMemberRequest $request, string $projectId)
    {
        $data = $request->validated();

        try {
            $user = User::where('email', $data['email'])->firstOrFail();
            $updated = $this->projects->inviteMember(
                projectUuid: $projectId,
                ownerId: $request->user()->id,
                email: $user->email,
                role: $data['role'] ?? null
            );
        } catch (ModelNotFoundException $exception) {
            throw new HttpException(Response::HTTP_FORBIDDEN, 'No tienes permisos para gestionar los miembros de este proyecto.');
        } catch (DomainException $exception) {
            throw new HttpException(Response::HTTP_CONFLICT, $exception->getMessage());
        }

        return (new ProjectResource($updated))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function destroy(Request $request, string $projectId, int $memberId)
    {
        try {
            $updated = $this->projects->removeMember($projectId, $request->user()->id, $memberId);
        } catch (ModelNotFoundException $exception) {
            throw new HttpException(Response::HTTP_FORBIDDEN, 'No tienes permisos para gestionar los miembros de este proyecto.');
        } catch (DomainException $exception) {
            throw new HttpException(Response::HTTP_CONFLICT, $exception->getMessage());
        }

        return (new ProjectResource($updated))->response();
    }

    public function invitations(Request $request, string $projectId)
    {
        try {
            $project = $this->projects->findForUser($projectId, $request->user()->id, ownerOnly: true, withRelations: true);
        } catch (ModelNotFoundException $exception) {
            throw new HttpException(Response::HTTP_FORBIDDEN, 'No tienes permisos para gestionar los miembros de este proyecto.');
        }

        return response()->json(['data' => $project->invitations]);
    }

    public function cancelInvitation(Request $request, string $projectId, int $invitationId)
    {
        try {
            $updated = $this->projects->cancelInvitation($projectId, $request->user()->id, $invitationId);
        } catch (ModelNotFoundException $exception) {
            throw new HttpException(Response::HTTP_FORBIDDEN, 'No tienes permisos para gestionar los miembros de este proyecto.');
        } catch (DomainException $exception) {
            throw new HttpException(Response::HTTP_CONFLICT, $exception->getMessage());
        }

        return (new ProjectResource($updated))->response();
    }
}
