<?php

namespace App\Rest\Command\Project;

use Illuminate\Foundation\Http\FormRequest;

class UpsertProjectRequest extends FormRequest
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
            'start_date.year' => ['required', 'integer', 'min:0', 'max:9999'],
            'start_date.month' => ['required', 'integer', 'min:0', 'max:11'],
            'start_date.week' => ['required', 'integer', 'min:0', 'max:3'],
            'end_date.year' => ['required', 'integer', 'min:0', 'max:9999'],
            'end_date.month' => ['required', 'integer', 'min:0', 'max:11'],
            'end_date.week' => ['required', 'integer', 'min:0', 'max:3'],
            'additional_fields' => ['nullable', 'array'],
            'additional_fields.*' => ['string'],
        ];
    }
}
