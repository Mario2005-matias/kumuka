<?php

namespace App\Http\Resources;

use App\Models\Lesson;
use App\Services\QuizGrader;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Lesson
 */
class LessonResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $grader = app(QuizGrader::class);

        return [
            'id' => (string) $this->id,
            'moduleId' => (string) $this->trail_module_id,
            'titulo' => $this->title,
            'resumo' => $this->summary ?? '',
            'duracao' => $this->duration_minutes,
            'percentagemMinima' => $this->completion_threshold,
            'obrigatoria' => $this->is_required,
            'ordem' => $this->position,
            'blocos' => LessonBlockResource::collection($this->whenLoaded('blocks')),
            'verificacao' => $this->whenLoaded('checkpointQuestions', fn (): array => $this->checkpointQuestions
                ->map(fn ($question): array => $grader->forStudent($question))
                ->all()),
        ];
    }
}
