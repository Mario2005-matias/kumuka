<?php

namespace Database\Seeders;

use App\Models\Trail;
use App\Models\TrailModule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Loads the curriculum of each trail from database/seeders/curriculum/{slug}.php.
 *
 * A file is applied when its "version" is newer than the trail's content_version, so content
 * can be revised and re-seeded. Applying replaces the trail's phases, modules, lessons and
 * question bank (students' progress in that trail starts again).
 *
 * Questions can be written in a compact form:
 * - ['single'|'multiple', prompt, ['* correct option', 'other option', ...], explanation, 'context' => ...]
 * - ['tf', prompt, true|false, explanation]
 * - ['order', prompt, ['first step', 'second step', ...], explanation]
 * - ['match', prompt, ['left' => 'right', ...], explanation]
 * - ['fill', prompt, ['accepted answer', ...], explanation]
 */
class CurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (glob(database_path('seeders/curriculum/*.php')) as $file) {
            $this->apply(require $file);
        }
    }

    /**
     * @param  array<string, mixed>  $curriculum
     */
    private function apply(array $curriculum): void
    {
        $trail = Trail::query()->where('slug', $curriculum['slug'])->first();

        if ($trail === null || $trail->content_version >= $curriculum['version']) {
            return;
        }

        DB::transaction(function () use ($trail, $curriculum): void {
            $trail->modules()->delete();
            $trail->phases()->delete();

            $phaseIds = collect($curriculum['phases'] ?? [])->map(fn (array $phase, int $index): int => $trail->phases()->create([
                'title' => $phase['title'],
                'description' => $phase['description'] ?? null,
                'position' => $index + 1,
            ])->id);

            $minutes = 0;

            foreach ($curriculum['modules'] as $position => $moduleData) {
                $module = $trail->modules()->create([
                    'trail_phase_id' => isset($moduleData['phase']) ? $phaseIds[$moduleData['phase']] : null,
                    'title' => $moduleData['title'],
                    'description' => $moduleData['description'],
                    'position' => $position + 1,
                    'quiz_question_count' => $moduleData['quiz'] ?? 5,
                    'quiz_passing_score' => 80,
                    'quiz_cooldown_minutes' => 5,
                ]);

                $moduleMinutes = $this->seedModule($module, $moduleData);
                $module->update(['duration_minutes' => $moduleMinutes]);
                $minutes += $moduleMinutes;
            }

            $trail->update([
                ...$curriculum['trail'],
                'duration_minutes' => $minutes,
                'content_version' => $curriculum['version'],
                'status' => 'published',
            ]);
        });
    }

    /**
     * @param  array<string, mixed>  $moduleData
     */
    private function seedModule(TrailModule $module, array $moduleData): int
    {
        $minutes = 10;

        foreach ($moduleData['lessons'] as $position => $lessonData) {
            $lesson = $module->lessons()->create([
                'title' => $lessonData['title'],
                'summary' => $lessonData['summary'],
                'duration_minutes' => $lessonData['minutes'] ?? 8,
                'position' => $position + 1,
            ]);
            $minutes += $lessonData['minutes'] ?? 8;

            foreach ($lessonData['blocks'] as $blockPosition => $block) {
                $lesson->blocks()->create([
                    ...(is_string($block) ? ['type' => 'texto', 'body' => $block] : $block),
                    'position' => $blockPosition + 1,
                ]);
            }

            foreach ($lessonData['check'] ?? [] as $index => $question) {
                $module->questions()->create([...$this->question($question), 'lesson_id' => $lesson->id, 'is_checkpoint' => true, 'position' => $index + 1]);
            }

            foreach ($lessonData['bank'] ?? [] as $index => $question) {
                $module->questions()->create([...$this->question($question), 'lesson_id' => $lesson->id, 'position' => $index + 1]);
            }
        }

        if (isset($moduleData['activity'])) {
            [$type, $prompt, $instructions] = $moduleData['activity'];
            $module->activity()->create([
                'type' => $type,
                'prompt' => $prompt,
                'instructions' => $instructions,
                'is_required' => true,
                'points' => 20,
            ]);
        }

        return $minutes;
    }

    /**
     * Expand a compact question into model attributes.
     *
     * @param  array<int|string, mixed>  $question
     * @return array<string, mixed>
     */
    public function question(array $question): array
    {
        if (isset($question['type'])) {
            return $question;
        }

        [$kind, $prompt, $answer, $explanation] = $question;
        $base = ['prompt' => $prompt, 'explanation' => $explanation, 'context' => $question['context'] ?? null];
        $letters = range('a', 'z');

        return $base + match ($kind) {
            'single', 'multiple' => [
                'type' => $kind,
                'options' => array_map(fn (string $text, int $index): array => [
                    'id' => $letters[$index],
                    'text' => ltrim($text, '* '),
                    'correct' => str_starts_with($text, '* '),
                ], $answer, array_keys($answer)),
            ],
            'tf' => ['type' => 'true_false', 'correct_boolean' => $answer],
            'order' => ['type' => 'ordering', 'options' => array_map(fn (string $text, int $index): array => ['id' => $letters[$index], 'text' => $text], $answer, array_keys($answer))],
            'match' => ['type' => 'matching', 'options' => array_map(fn (string $left, string $right, int $index): array => ['id' => $letters[$index], 'left' => $left, 'right' => $right], array_keys($answer), $answer, range(0, count($answer) - 1))],
            'fill' => ['type' => 'fill_blank', 'accepted_answers' => $answer],
        };
    }
}
