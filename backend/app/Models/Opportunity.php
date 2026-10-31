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
    'company_id', 'slug', 'title', 'subtitle', 'summary', 'description', 'type', 'area', 'location',
    'modality', 'responsibilities', 'requirements', 'benefits', 'deadline_at', 'cta_type', 'cta_url',
    'status', 'banner',
])]
class Opportunity extends Model
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
     * @return HasMany<OpportunityApplication, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(OpportunityApplication::class);
    }

    /**
     * Whether students can still register interest or apply.
     */
    public function isOpen(): bool
    {
        return $this->status === 'aberta' && $this->deadline_at->isFuture();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'requirements' => 'array',
            'benefits' => 'array',
            'deadline_at' => 'datetime',
        ];
    }
}
