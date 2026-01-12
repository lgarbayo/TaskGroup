<?php

namespace App\Rest\Command\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpsertTaskCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'min:1', 'max:2000'],
        ];
    }
}
