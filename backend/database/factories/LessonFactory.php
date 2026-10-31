<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\TrailModule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lesson>
 */
class LessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'trail_module_id' => TrailModule::factory(),
            'title' => fake()->sentence(3),
            'summary' => fake()->sentence(),
            'duration_minutes' => 8,
            'completion_threshold' => 90,
            'is_required' => true,
            'position' => 1,
        ];
    }
}
