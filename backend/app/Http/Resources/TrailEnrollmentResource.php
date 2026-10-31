<?php

namespace App\Http\Resources;

use App\Models\TrailEnrollment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Summary of a student's progress in a trail, used by the dashboard and journey.
 *
 * @mixin TrailEnrollment
 */
class TrailEnrollmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'trailId' => (string) $this->trail_id,
            'estado' => $this->completed_at === null ? 'em_progresso' : 'concluido',
            'percentual' => $this->percent,
            'moduloAtualId' => $this->current_module_id === null ? null : (string) $this->current_module_id,
            'iniciadoEm' => $this->started_at->toIso8601ZuluString(),
            'atualizadoEm' => ($this->last_activity_at ?? $this->started_at)->toIso8601ZuluString(),
            'concluidoEm' => $this->completed_at?->toIso8601ZuluString(),
            'trilha' => $this->whenLoaded('trail', fn (): TrailResource => new TrailResource($this->trail)),
        ];
    }
}
