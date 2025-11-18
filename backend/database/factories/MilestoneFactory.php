<?php

namespace Database\Factories;

use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Entity\Milestone;
use Illuminate\Database\Eloquent\Factories\Factory;

class MilestoneFactory extends Factory
{
    protected $model = Milestone::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->sentence(),
            'date_year' => 2025,
            'date_month' => fake()->numberBetween(0, 11),
            'date_week' => fake()->numberBetween(0, 3),
        ];
    }
}
