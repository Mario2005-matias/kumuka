<?php

namespace App\Models;

use App\Enums\LessonType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'type', 'title', 'body', 'media_url', 'media_duration_seconds',
    'min_engaged_seconds', 'completion_threshold', 'is_required', 'position',
])]
class Lesson extends Model
{
    use HasFactory;

    /**
     * Seconds of video covered by each watched segment.
     */
    public const SEGMENT_SECONDS = 5;

    /**
     * @return BelongsTo<TrailModule, $this>
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(TrailModule::class, 'trail_module_id');
    }

    /**
     * Minimum seconds the student must actively spend on the lesson.
     *
     * Text lessons default to half the time needed to read the body at 200 words per minute.
     */
    public function requiredEngagedSeconds(): int
    {
        if ($this->min_engaged_seconds !== null) {
            return $this->min_engaged_seconds;
        }

        return match ($this->type) {
            LessonType::Text => (int) min(600, max(15, ceil(str_word_count(strip_tags((string) $this->body)) / 200 * 60 * 0.5))),
            LessonType::Image => 5,
            default => 0,
        };
    }

    /**
     * Number of video segments the lesson is split into.
     */
    public function segmentCount(): int
    {
        return (int) max(1, ceil(($this->media_duration_seconds ?? 0) / self::SEGMENT_SECONDS));
    }

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'type' => LessonType::class,
            'is_required' => 'boolean',
        ];
    }
}
