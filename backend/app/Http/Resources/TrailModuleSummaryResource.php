<?php

namespace App\Http\Resources;

use App\Models\TrailModule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TrailModule
 */
class TrailModuleSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'faseId' => $this->trail_phase_id === null ? null : (string) $this->trail_phase_id,
            'titulo' => $this->title,
            'descricao' => $this->description ?? '',
            'ordem' => $this->position,
            'duracao' => $this->duration_minutes,
            'totalAulas' => $this->whenCounted('lessons'),
            'temAtividade' => $this->whenLoaded('activity', fn (): bool => $this->activity !== null),
            'quiz' => $this->whenCounted('quizQuestions', fn (): ?array => $this->quiz_questions_count === 0 ? null : [
                'perguntas' => min($this->quiz_questions_count, $this->quiz_question_count),
                'notaMinima' => $this->quiz_passing_score,
            ]),
        ];
    }
}
