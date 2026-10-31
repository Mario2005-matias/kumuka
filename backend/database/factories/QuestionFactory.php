<?php

namespace Database\Factories;

use App\Enums\QuestionType;
use App\Models\Question;
use App\Models\TrailModule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state: a single-choice question whose correct option is "a".
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'trail_module_id' => TrailModule::factory(),
            'type' => QuestionType::Single,
            'prompt' => fake()->sentence().'?',
            'options' => [
                ['id' => 'a', 'text' => 'Certa', 'correct' => true],
                ['id' => 'b', 'text' => 'Errada', 'correct' => false],
            ],
            'explanation' => 'Porque a opção A está certa.',
            'is_active' => true,
        ];
    }

    /**
     * A checkpoint question shown at the end of the given lesson.
     */
    public function checkpoint(): static
    {
        return $this->state(fn (array $attributes) => ['is_checkpoint' => true]);
    }
}
