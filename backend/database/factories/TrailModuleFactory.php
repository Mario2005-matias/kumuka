<?php

namespace Database\Factories;

use App\Models\Trail;
use App\Models\TrailModule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TrailModule>
 */
class TrailModuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'trail_id' => Trail::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->sentence(),
            'position' => 1,
            'duration_minutes' => 30,
        ];
    }
}
