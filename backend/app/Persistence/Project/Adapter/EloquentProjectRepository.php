<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Model\ProjectModel;
use App\Business\Project\Port\ProjectRepository;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Entity\ProjectInvitation;
use App\Persistence\Project\Mapper\ProjectMapper;
use App\Persistence\User\Entity\User;
use DomainException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class EloquentProjectRepository implements ProjectRepository
{
    public function listForUser(int $userId): iterable
    {
        return Project::query()
            ->withCount('tasks')
            ->where('owner_id', $userId)
            ->orWhereHas('members', fn (Builder $members) => $members->where('user_id', $userId))
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn ($project) => ProjectMapper::toModel($project))
            ->all();
    }

    public function create(int $ownerId, array $data): ProjectModel
    {
        $project = Project::create(array_merge($data, ['owner_id' => $ownerId]));
        $project->members()->attach($ownerId, ['role' => 'owner']);

        return ProjectMapper::toModel($project);
    }

    public function findForUser(string $uuid, int $userId, bool $ownerOnly = false, bool $withRelations = false): ProjectModel
    {
        $query = Project::query()->where('uuid', $uuid);

        if ($ownerOnly) {
            $query->where('owner_id', $userId);
        } else {
            $query->where(function ($builder) use ($userId) {
                $builder
                    ->where('owner_id', $userId)
                    ->orWhereHas('members', fn ($members) => $members->where('user_id', $userId));
            });
        }

        $project = $query->firstOrFail();

        if ($withRelations) {
            $project->load(['owner', 'members', 'tasks.assignee', 'milestones', 'invitations']);
        }

        return ProjectMapper::toModel($project, withRelations: $withRelations);
    }

    public function update(string $projectUuid, int $userId, array $data): ProjectModel
    {
        $project = $this->loadOwnedProject($projectUuid, $userId);
        $project->update($data);

        return ProjectMapper::toModel($project->fresh());
    }

    public function delete(string $projectUuid, int $userId): void
    {
        $project = $this->loadOwnedProject($projectUuid, $userId);
        $project->delete();
    }

    public function inviteMember(string $projectUuid, int $ownerId, string $email, ?string $role = null): ProjectModel
    {
        $project = $this->loadOwnedProject($projectUuid, $ownerId);
        $user = User::where('email', $email)->firstOrFail();

        if ($project->members()->where('users.id', $user->id)->exists()) {
            throw new DomainException('Este usuario ya pertenece al proyecto.');
        }

        $project->members()->attach($user->id, ['role' => $role ?? 'member']);

        return ProjectMapper::toModel($project->fresh(['members']), withRelations: true);
    }

    public function cancelInvitation(string $projectUuid, int $ownerId, int $invitationId): ProjectModel
    {
        $project = $this->loadOwnedProject($projectUuid, $ownerId);
        $invitation = $project->invitations()->where('id', $invitationId)->firstOrFail();
        $invitation->update(['status' => 'cancelled']);

        return ProjectMapper::toModel($project->fresh(['invitations']));
    }

    public function acceptInvitation(string $token, int $userId): ProjectModel
    {
        $invitation = ProjectInvitation::query()
            ->where('token', $token)
            ->where('status', 'pending')
            ->firstOrFail();

        $user = User::findOrFail($userId);
        if (strcasecmp($invitation->email, $user->email) !== 0) {
            throw new DomainException('Esta invitación no corresponde a tu cuenta.');
        }

        $project = $invitation->project()->lockForUpdate()->first();
        if (!$project) {
            throw new DomainException('El proyecto de la invitación no existe.');
        }

        if ($project->members()->where('user_id', $user->id)->exists()) {
            $invitation->update(['status' => 'accepted', 'invitee_id' => $user->id, 'accepted_at' => now()]);
            return ProjectMapper::toModel($project->fresh(['members', 'invitations']));
        }

        DB::transaction(function () use ($project, $user, $invitation) {
            $project->members()->attach($user->id, ['role' => $invitation->role]);
            $invitation->update([
                'status' => 'accepted',
                'invitee_id' => $user->id,
                'accepted_at' => now(),
            ]);
        });

        return ProjectMapper::toModel($project->fresh(['members', 'invitations']));
    }

    public function removeMember(string $projectUuid, int $ownerId, int $memberId): ProjectModel
    {
        $project = $this->loadOwnedProject($projectUuid, $ownerId);
        if ($memberId === $project->owner_id) {
            throw new DomainException('No puedes eliminar al propietario.');
        }

        $project->members()->detach($memberId);

        return ProjectMapper::toModel($project->fresh(['members']), withRelations: true);
    }


    private function loadOwnedProject(string $uuid, int $userId): Project
    {
        return Project::query()
            ->where('uuid', $uuid)
            ->where('owner_id', $userId)
            ->firstOrFail();
    }
}
