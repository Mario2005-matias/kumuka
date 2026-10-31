<?php

namespace App\Http\Resources;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Achievement
 */
class AchievementResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $unlockedAt = $this->unlocked_at ?? null;

        return [
            'id' => $this->code,
            'titulo' => $this->title,
            'descricao' => $this->description,
            'unlocked' => $unlockedAt !== null,
            'unlockedAt' => $unlockedAt === null ? null : now()->parse($unlockedAt)->toIso8601ZuluString(),
        ];
    }
}
