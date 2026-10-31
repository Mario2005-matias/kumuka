<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('lesson_progress')]
#[Fillable(['lesson_id', 'engaged_seconds', 'watched_segments', 'last_position_seconds', 'reached_end', 'last_heartbeat_at', 'completed_at'])]
class LessonProgress extends Model
{
    /**
     * @return BelongsTo<Lesson, $this>
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reached_end' => 'boolean',
            'last_heartbeat_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }
}
