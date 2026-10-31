<?php

namespace App\Models;

use App\Enums\LessonType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['type', 'title', 'body', 'media_url', 'file_path', 'duration_seconds', 'position'])]
class LessonBlock extends Model
{
    use HasFactory;

    /**
     * Seconds of video covered by each watched segment.
     */
    public const SEGMENT_SECONDS = 5;

    /**
     * @return BelongsTo<Lesson, $this>
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Public address of an uploaded file, or the external media URL.
     */
    public function resolvedUrl(): ?string
    {
        if ($this->file_path !== null) {
            return Storage::disk('public')->url($this->file_path);
        }

        return $this->media_url;
    }

    /**
     * Number of segments a video block is split into for watch tracking.
     */
    public function segmentCount(): int
    {
        return (int) max(1, ceil(($this->duration_seconds ?? 0) / self::SEGMENT_SECONDS));
    }

    /**
     * Whether watching this block is part of completing the lesson.
     */
    public function isTracked(): bool
    {
        return $this->type === LessonType::Video && ($this->duration_seconds ?? 0) > 0;
    }

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return ['type' => LessonType::class];
    }
}
