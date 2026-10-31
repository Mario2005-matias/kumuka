<?php

namespace Database\Factories;

use App\Enums\LessonType;
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
            'type' => LessonType::Text,
            'title' => fake()->sentence(3),
            'body' => fake()->paragraph(),
            'min_engaged_seconds' => 20,
            'completion_threshold' => 90,
            'is_required' => true,
            'position' => 1,
        ];
    }

    /**
     * A video lesson of the given length.
     */
    public function video(int $seconds = 60): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => LessonType::Video,
            'media_url' => 'https://cdn.example.test/video.mp4',
            'media_duration_seconds' => $seconds,
            'min_engaged_seconds' => null,
        ]);
    }

    /**
     * An external link lesson.
     */
    public function link(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => LessonType::Link,
            'media_url' => 'https://example.test/artigo',
            'min_engaged_seconds' => null,
        ]);
    }
}
