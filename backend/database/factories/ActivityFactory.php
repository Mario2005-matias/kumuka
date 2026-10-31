<?php

namespace Database\Factories;

use App\Enums\ActivityType;
use App\Models\Activity;
use App\Models\TrailModule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Activity>
 */
class ActivityFactory extends Factory
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
            'type' => ActivityType::Writing,
            'prompt' => fake()->sentence(),
            'instructions' => fake()->sentence(),
            'is_required' => true,
            'points' => 20,
        ];
    }
}
