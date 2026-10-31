<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('lesson_block_progress')]
#[Fillable(['lesson_block_id', 'watched_segments', 'last_position_seconds', 'last_heartbeat_at', 'completed_at'])]
class LessonBlockProgress extends Model
{
    /**
     * @return BelongsTo<LessonBlock, $this>
     */
    public function block(): BelongsTo
    {
        return $this->belongsTo(LessonBlock::class, 'lesson_block_id');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_heartbeat_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }
}
