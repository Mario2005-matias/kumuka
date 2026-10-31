<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['name', 'age', 'situation', 'location', 'interests', 'goal', 'bio', 'linkedin_url', 'portfolio_url', 'photo', 'banner', 'competences', 'onboarding_step', 'onboarding_completed_at'])]
class StudentProfile extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'interests' => 'array',
            'competences' => 'array',
            'onboarding_completed_at' => 'datetime',
        ];
    }
}
