<?php

namespace App\Models;

use App\Enums\ActivityType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['type', 'prompt', 'instructions', 'is_required', 'points'])]
class Activity extends Model
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
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'type' => ActivityType::class,
            'is_required' => 'boolean',
        ];
    }
}
