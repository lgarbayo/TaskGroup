<?php

namespace App\Rest\Command\Milestone;

use Illuminate\Foundation\Http\FormRequest;

class UpsertMilestoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string'],
            'date.year' => ['required', 'integer', 'min:0', 'max:9999'],
            'date.month' => ['required', 'integer', 'min:0', 'max:11'],
            'date.week' => ['required', 'integer', 'min:0', 'max:3'],
        ];
    }
}
