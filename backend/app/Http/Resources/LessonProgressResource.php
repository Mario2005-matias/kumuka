<?php

namespace App\Http\Resources;

use App\Models\LessonProgress;
use App\Services\TrailProgressService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin LessonProgress
 */
class LessonProgressResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'lessonId' => (string) $this->lesson_id,
            'concluida' => $this->completed_at !== null,
            'percentual' => app(TrailProgressService::class)->lessonPercent($this->lesson, $this->resource),
            'segundosEnvolvidos' => $this->engaged_seconds,
            'chegouAoFim' => $this->reached_end,
            'posicao' => $this->last_position_seconds,
            'concluidaEm' => $this->completed_at?->toIso8601ZuluString(),
        ];
    }
}
