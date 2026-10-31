<?php

namespace App\Http\Resources;

use App\Models\Lesson;
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
        return [
            'id' => (string) $this->id,
            'moduleId' => (string) $this->trail_module_id,
            'tipo' => $this->type->value,
            'titulo' => $this->title,
            'conteudo' => $this->body ?? '',
            'mediaUrl' => $this->media_url,
            'duracaoMedia' => $this->media_duration_seconds,
            'segundosNecessarios' => $this->requiredEngagedSeconds(),
            'percentagemMinima' => $this->completion_threshold,
            'obrigatoria' => $this->is_required,
            'ordem' => $this->position,
        ];
    }
}
