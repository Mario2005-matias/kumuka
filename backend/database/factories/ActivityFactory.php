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
            'passing_score' => 70,
        ];
    }

    /**
     * A two-question quiz whose correct answers are "a".
     */
    public function quiz(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ActivityType::Quiz,
            'questions' => [
                ['id' => 'q1', 'enunciado' => 'Pergunta 1', 'opcoes' => [['id' => 'a', 'texto' => 'A'], ['id' => 'b', 'texto' => 'B']], 'respostaCorretaId' => 'a'],
                ['id' => 'q2', 'enunciado' => 'Pergunta 2', 'opcoes' => [['id' => 'a', 'texto' => 'A'], ['id' => 'b', 'texto' => 'B']], 'respostaCorretaId' => 'a'],
            ],
        ]);
    }
}
