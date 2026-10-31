<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'trail_id', 'trail_phase_id', 'title', 'description', 'position', 'duration_minutes',
    'quiz_question_count', 'quiz_passing_score', 'quiz_cooldown_minutes',
])]
class TrailModule extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo<Trail, $this>
     */
    public function trail(): BelongsTo
    {
        return $this->belongsTo(Trail::class);
    }

    /**
     * @return BelongsTo<TrailPhase, $this>
     */
    public function phase(): BelongsTo
    {
        return $this->belongsTo(TrailPhase::class, 'trail_phase_id');
    }

    /**
     * @return HasMany<Lesson, $this>
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('position');
    }

    /**
     * @return HasMany<Question, $this>
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('position');
    }

    /**
     * Active questions the module quiz draws from (checkpoint questions are excluded).
     *
     * @return HasMany<Question, $this>
     */
    public function quizQuestions(): HasMany
    {
        return $this->hasMany(Question::class)->where('is_checkpoint', false)->where('is_active', true);
    }

    /**
     * @return HasMany<ModuleCompletion, $this>
     */
    public function completions(): HasMany
    {
        return $this->hasMany(ModuleCompletion::class);
    }

    /**
     * @return HasOne<Activity, $this>
     */
    public function activity(): HasOne
    {
        return $this->hasOne(Activity::class);
    }
}
