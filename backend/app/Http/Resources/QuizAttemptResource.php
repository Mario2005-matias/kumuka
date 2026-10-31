<?php

namespace App\Http\Resources;

use App\Models\QuizAttempt;
use App\Services\QuizGrader;
use App\Services\QuizService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * An attempt with its questions; once submitted, it also carries the score and per-question feedback.
 *
 * @mixin QuizAttempt
 */
class QuizAttemptResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isSubmitted = $this->submitted_at !== null;

        return [
            'id' => (string) $this->id,
            'moduleId' => (string) $this->trail_module_id,
            'lessonId' => $this->lesson_id === null ? null : (string) $this->lesson_id,
            'perguntas' => $isSubmitted && $this->lesson_id !== null
                ? []
                : app(QuizService::class)->questions($this->question_ids)
                    ->map(fn ($question): array => app(QuizGrader::class)->forStudent($question))
                    ->all(),
            'submetida' => $isSubmitted,
            'nota' => $this->score,
            'aprovada' => $this->passed,
            'resultados' => $isSubmitted ? $this->results : null,
            'submetidaEm' => $this->submitted_at?->toIso8601ZuluString(),
        ];
    }
}
