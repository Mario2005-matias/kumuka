<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\RouteKey;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[RouteKey('slug')]
#[Fillable([
    'slug', 'title', 'summary', 'description', 'category', 'core_competence', 'level',
    'duration_minutes', 'expected_outcome', 'target_audience', 'prerequisites',
    'learning_objectives', 'status', 'access', 'price', 'image', 'has_certificate', 'is_sequential',
])]
class Trail extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @return HasMany<TrailPhase, $this>
     */
    public function phases(): HasMany
    {
        return $this->hasMany(TrailPhase::class)->orderBy('position');
    }

    /**
     * @return HasMany<TrailModule, $this>
     */
    public function modules(): HasMany
    {
        return $this->hasMany(TrailModule::class)->orderBy('position');
    }

    /**
     * @return HasMany<TrailEnrollment, $this>
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(TrailEnrollment::class);
    }

    /**
     * @param  Builder<Trail>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'prerequisites' => 'array',
            'learning_objectives' => 'array',
            'has_certificate' => 'boolean',
            'is_sequential' => 'boolean',
            'price' => 'decimal:2',
        ];
    }
}
