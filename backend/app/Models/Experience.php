<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\RouteKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[RouteKey('slug')]
#[Fillable([
    'company_id', 'slug', 'title', 'subtitle', 'summary', 'description', 'type', 'organizer',
    'organizer_logo', 'starts_at', 'ends_at', 'location', 'location_details', 'modality', 'benefits',
    'requirements', 'schedule', 'speakers', 'capacity', 'is_closed', 'banner', 'gallery',
])]
class Experience extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo<Company, $this>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return HasMany<ExperienceRegistration, $this>
     */
    public function registrations(): HasMany
    {
        return $this->hasMany(ExperienceRegistration::class);
    }

    /**
     * Whether new registrations are accepted.
     */
    public function acceptsRegistrations(): bool
    {
        return ! $this->is_closed
            && ($this->ends_at ?? $this->starts_at)->isFuture()
            && $this->activeRegistrationsCount() < $this->capacity;
    }

    /**
     * Number of registrations holding a seat.
     */
    public function activeRegistrationsCount(): int
    {
        return $this->active_registrations_count
            ?? $this->registrations()->where('status', '!=', 'cancelado')->count();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'benefits' => 'array',
            'requirements' => 'array',
            'schedule' => 'array',
            'speakers' => 'array',
            'gallery' => 'array',
            'is_closed' => 'boolean',
        ];
    }
}
