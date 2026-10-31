<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'email' => $this->email,
            'role' => 'student',
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
            'onboardingCompleted' => $this->profile?->onboarding_completed_at !== null,
            'onboardingStep' => $this->profile?->onboarding_step ?? 0,
        ];
    }
}
