<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['trail_module_id', 'title', 'summary', 'duration_minutes', 'completion_threshold', 'is_required', 'position'])]
class Lesson extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo<TrailModule, $this>
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(TrailModule::class, 'trail_module_id');
    }

    /**
     * @return HasMany<LessonBlock, $this>
     */
    public function blocks(): HasMany
    {
        return $this->hasMany(LessonBlock::class)->orderBy('position');
    }

    /**
     * Short questions answered at the end of the lesson.
     *
     * @return HasMany<Question, $this>
     */
    public function checkpointQuestions(): HasMany
    {
        return $this->hasMany(Question::class)
            ->where('is_checkpoint', true)
            ->where('is_active', true)
            ->orderBy('position');
    }

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return ['is_required' => 'boolean'];
    }
}
