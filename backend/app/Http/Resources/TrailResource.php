<?php

namespace App\Http\Resources;

use App\Models\Trail;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Trail
 */
class TrailResource extends JsonResource
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
            'descricaoLonga' => $this->description,
            'categoria' => $this->category,
            'competenciaCentral' => $this->core_competence,
            'nivel' => $this->level,
            'duracao' => round($this->duration_minutes / 60, 1),
            'resultadoEsperado' => $this->expected_outcome,
            'publicoAlvo' => $this->target_audience ?? '',
            'preRequisitos' => $this->prerequisites ?? [],
            'objetivosAprendizagem' => $this->learning_objectives ?? [],
            'status' => $this->status,
            'acesso' => $this->access,
            'preco' => $this->price === null ? null : (float) $this->price,
            'imagem' => $this->image,
            'certificado' => $this->has_certificate,
            'sequencial' => $this->is_sequential,
            'totalFases' => $this->whenCounted('phases', fn () => $this->phases_count, fn () => $this->phases->count()),
            'totalModulos' => $this->whenCounted('modules', fn () => $this->modules_count, fn () => $this->modules->count()),
            'fases' => TrailPhaseResource::collection($this->whenLoaded('phases')),
            'modulos' => TrailModuleSummaryResource::collection($this->whenLoaded('modules')),
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
            'updatedAt' => $this->updated_at?->toIso8601ZuluString(),
        ];
    }
}
