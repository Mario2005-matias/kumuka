<?php

namespace App\Http\Resources;

use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Opportunity
 */
class OpportunityResource extends JsonResource
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
            'subtitulo' => $this->subtitle ?? '',
            'descricao' => $this->summary,
            'descricaoLonga' => $this->description,
            'tipo' => $this->type,
            'empresaId' => (string) $this->company_id,
            'empresaNome' => $this->company->name,
            'empresaLogo' => $this->company->logo,
            'area' => $this->area,
            'localizacao' => $this->location,
            'modalidade' => $this->modality,
            'responsabilidades' => $this->responsibilities ?? [],
            'requisitos' => $this->requirements ?? [],
            'beneficios' => $this->benefits ?? [],
            'prazo' => $this->deadline_at->toDateString(),
            'ctaTipo' => $this->cta_type,
            'ctaDestino' => $this->cta_url,
            'estado' => match (true) {
                $this->status !== 'aberta' => 'fechada',
                $this->deadline_at->isPast() => 'prazo_encerrado',
                default => 'aberta',
            },
            'banner' => $this->banner,
            'criadoEm' => $this->created_at?->toIso8601ZuluString(),
            'atualizadoEm' => $this->updated_at?->toIso8601ZuluString(),
        ];
    }
}
