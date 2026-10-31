<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One try at a module quiz, or at a lesson checkpoint when lesson_id is set.
 */
#[Fillable(['trail_module_id', 'lesson_id', 'question_ids', 'answers', 'results', 'score', 'passed', 'submitted_at'])]
class QuizAttempt extends Model
{
    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<TrailModule, $this>
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(TrailModule::class, 'trail_module_id');
    }

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'question_ids' => 'array',
            'answers' => 'array',
            'results' => 'array',
            'passed' => 'boolean',
            'submitted_at' => 'datetime',
        ];
    }
}
