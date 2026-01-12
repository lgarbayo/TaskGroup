<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Task\UpsertTaskCommentRequest;
use App\Rest\Response\TaskCommentResource;
use App\Business\Facade\ProjectFacade;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaskCommentController extends Controller
{
    public function __construct(private ProjectFacade $facade)
    {
    }

    public function index(Request $request, string $project, string $task)
    {
        $this->facade->getProject($project, $request->user()->id);
        $comments = $this->facade->listTaskComments($project, $task, $request->user()->id);

        return TaskCommentResource::collection($comments);
    }

    public function store(UpsertTaskCommentRequest $request, string $project, string $task)
    {
        $data = $request->validated();
        $comment = $this->facade->createTaskComment($project, $task, $request->user()->id, [
            'body' => $data['body'],
        ]);

        return (new TaskCommentResource($comment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpsertTaskCommentRequest $request, string $project, string $task, int $comment)
    {
        $data = $request->validated();
        $updated = $this->facade->updateTaskComment($project, $task, $comment, $request->user()->id, [
            'body' => $data['body'],
        ]);

        return new TaskCommentResource($updated);
    }

    public function destroy(Request $request, string $project, string $task, int $comment)
    {
        $this->facade->deleteTaskComment($project, $task, $comment, $request->user()->id);

        return response()->noContent();
    }
}
