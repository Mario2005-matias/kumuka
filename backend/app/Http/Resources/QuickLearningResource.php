<?php

namespace App\Http\Resources;

use App\Models\QuickLearning;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin QuickLearning
 */
class QuickLearningResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'titulo' => $this->title,
            'descricao' => $this->summary,
            'categoria' => $this->category,
            'duracao' => $this->duration_minutes,
            'conteudo' => $this->body,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
            'updatedAt' => $this->updated_at?->toIso8601ZuluString(),
        ];
    }
}
