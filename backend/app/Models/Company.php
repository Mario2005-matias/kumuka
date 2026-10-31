<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['slug', 'name', 'logo', 'description', 'area', 'website', 'culture', 'status'])]
class Company extends Model
{
    use SoftDeletes;

    /**
     * @return HasMany<Opportunity, $this>
     */
    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class);
    }
}
