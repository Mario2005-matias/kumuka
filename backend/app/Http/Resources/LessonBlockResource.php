<?php

namespace App\Http\Resources;

use App\Models\LessonBlock;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin LessonBlock
 */
class LessonBlockResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'tipo' => $this->type->value,
            'titulo' => $this->title,
            'conteudo' => $this->body ?? '',
            'url' => $this->resolvedUrl(),
            'duracao' => $this->duration_seconds,
            'acompanhado' => $this->isTracked(),
            'ordem' => $this->position,
        ];
    }
}
