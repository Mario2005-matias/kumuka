<?php

namespace App\Http\Resources;

use App\Models\StudentProfile;
use App\Support\PublicFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin StudentProfile
 */
class ProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'userId' => (string) $this->user_id,
            'nome' => $this->name ?? '',
            'idade' => $this->age,
            'situacao' => $this->situation ?? '',
            'localizacao' => $this->location ?? '',
            'interesses' => $this->interests ?? [],
            'objetivo' => $this->goal ?? '',
            'bio' => $this->bio ?? '',
            'linkedin' => $this->linkedin_url,
            'portfolio' => $this->portfolio_url,
            'foto' => PublicFile::url($this->photo),
            'banner' => PublicFile::url($this->banner),
            'competencias' => $this->competences ?? [],
            'onboardingCompleted' => $this->onboarding_completed_at !== null,
            'onboardingStep' => $this->onboarding_step,
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
