<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['trail_id', 'trail_phase_id', 'title', 'description', 'position', 'duration_minutes'])]
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
     * @return HasOne<Activity, $this>
     */
    public function activity(): HasOne
    {
        return $this->hasOne(Activity::class);
    }
}
