<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('lesson_progress')]
#[Fillable(['lesson_id', 'completed_at'])]
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
        return ['completed_at' => 'datetime'];
    }
}
