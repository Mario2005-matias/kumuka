<?php

namespace App\Models;

use App\Enums\QuestionType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * A question from a module's bank.
 *
 * Options are stored in an editor-friendly shape per type:
 * - single / multiple: [{id, text, correct}]
 * - ordering: [{id, text}] in the correct order
 * - matching: [{id, left, right}]
 * - fill_blank uses accepted_answers; true_false uses correct_boolean.
 */
#[Fillable([
    'trail_module_id', 'lesson_id', 'is_checkpoint', 'type', 'context', 'prompt', 'options',
    'accepted_answers', 'correct_boolean', 'explanation', 'is_active', 'position',
])]
class Question extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::saving(function (Question $question): void {
            if (in_array($question->type, [QuestionType::TrueFalse, QuestionType::FillBlank], true)) {
                $question->options = null;
            }

            if ($question->type !== QuestionType::TrueFalse) {
                $question->correct_boolean = null;
            }

            if ($question->type !== QuestionType::FillBlank) {
                $question->accepted_answers = null;
            }

            $question->options = collect($question->options ?? [])
                ->map(fn (array $option): array => [...$option, 'id' => $option['id'] ?? Str::lower(Str::random(8))])
                ->values()
                ->all() ?: null;
        });
    }

    /**
     * @return BelongsTo<TrailModule, $this>
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(TrailModule::class, 'trail_module_id');
    }

    /**
     * Lesson the question comes from, used to send students back to review it.
     *
     * @return BelongsTo<Lesson, $this>
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'type' => QuestionType::class,
            'options' => 'array',
            'accepted_answers' => 'array',
            'correct_boolean' => 'boolean',
            'is_checkpoint' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
