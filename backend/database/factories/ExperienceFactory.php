<?php

namespace Database\Factories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Experience>
 */
class ExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'slug' => Str::slug($title),
            'title' => $title,
            'summary' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'type' => 'workshop',
            'organizer' => 'KUMUKA',
            'starts_at' => now()->addWeek(),
            'location' => 'Luanda',
            'modality' => 'presencial',
            'capacity' => 10,
        ];
    }
}
