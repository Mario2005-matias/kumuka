<?php

namespace App\Http\Resources;

use App\Models\ActivitySubmission;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ActivitySubmission
 */
class ActivitySubmissionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'activityId' => (string) $this->activity_id,
            'resposta' => $this->answer,
            'temFicheiro' => $this->file_path !== null,
            'submetida' => $this->submitted_at !== null,
            'aprovada' => $this->passed_at !== null,
            'nota' => $this->score,
            'tentativas' => $this->attempts,
            'submetidaEm' => $this->submitted_at?->toIso8601ZuluString(),
        ];
    }
}
