<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Faq>
 */
class FaqFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category' => 'Sobre a KUMUKA',
            'question' => fake()->sentence().'?',
            'answer' => fake()->paragraph(),
            'position' => 1,
            'is_published' => true,
        ];
    }
}
