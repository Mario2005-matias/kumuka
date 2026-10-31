<?php

namespace Database\Factories;

use App\Models\Trail;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Trail>
 */
class TrailFactory extends Factory
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
            'category' => 'Carreira',
            'core_competence' => 'Comunicação',
            'level' => 'iniciante',
            'duration_minutes' => 360,
            'expected_outcome' => fake()->sentence(),
            'status' => 'published',
            'access' => 'free',
            'has_certificate' => false,
            'is_sequential' => true,
        ];
    }

    /**
     * Indicate that the trail lets students open modules in any order.
     */
    public function freeOrder(): static
    {
        return $this->state(fn (array $attributes) => ['is_sequential' => false]);
    }

    /**
     * Indicate that the trail is not published.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'draft']);
    }
}
