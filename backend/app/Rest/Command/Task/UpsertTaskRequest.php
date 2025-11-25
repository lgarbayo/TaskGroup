<?php

namespace App\Rest\Command\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpsertTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:pending,done'],
            'duration_weeks' => ['required', 'integer', 'min:1'],
            'start_date.year' => ['required', 'integer', 'min:0', 'max:9999'],
            'start_date.month' => ['required', 'integer', 'min:0', 'max:11'],
            'start_date.week' => ['required', 'integer', 'min:0', 'max:3'],
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
            'milestone_uuid' => ['nullable', 'string', 'exists:milestones,uuid'],
        ];
    }
}
