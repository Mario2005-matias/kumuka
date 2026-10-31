<?php

namespace App\Http\Resources;

use App\Models\ExperienceRegistration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ExperienceRegistration
 */
class ExperienceRegistrationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'experienceId' => (string) $this->experience_id,
            'estado' => $this->status,
            'inscritoEm' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
