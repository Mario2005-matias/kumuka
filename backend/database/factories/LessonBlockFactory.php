<?php

namespace Database\Factories;

use App\Enums\LessonType;
use App\Models\Lesson;
use App\Models\LessonBlock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LessonBlock>
 */
class LessonBlockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lesson_id' => Lesson::factory(),
            'type' => LessonType::Text,
            'body' => fake()->paragraph(),
            'position' => 1,
        ];
    }

    /**
     * A video block of the given length.
     */
    public function video(int $seconds = 100): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => LessonType::Video,
            'body' => null,
            'media_url' => 'https://cdn.example.test/video.mp4',
            'duration_seconds' => $seconds,
        ]);
    }
}
