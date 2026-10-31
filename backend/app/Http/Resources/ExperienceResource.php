<?php

namespace App\Http\Resources;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Experience
 */
class ExperienceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $occupied = $this->activeRegistrationsCount();
        $isRegistered = (bool) ($this->is_registered ?? false);

        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'titulo' => $this->title,
            'subtitulo' => $this->subtitle ?? '',
            'descricao' => $this->summary,
            'descricaoLonga' => $this->description,
            'tipo' => $this->type,
            'organizador' => $this->organizer,
            'organizadorLogo' => $this->organizer_logo,
            'empresaId' => $this->company_id === null ? null : (string) $this->company_id,
            'dataInicio' => $this->starts_at->toDateString(),
            'hora' => $this->starts_at->format('H:i'),
            'dataFim' => $this->ends_at?->toDateString(),
            'local' => $this->location,
            'localDetalhado' => $this->location_details,
            'modalidade' => $this->modality,
            'beneficios' => $this->benefits ?? [],
            'requisitos' => $this->requirements ?? [],
            'programa' => $this->schedule ?? [],
            'oradores' => $this->speakers ?? [],
            'vagas' => $this->capacity,
            'vagasOcupadas' => $occupied,
            'estado' => match (true) {
                $isRegistered => 'inscrita',
                $this->is_closed || ($this->ends_at ?? $this->starts_at)->isPast() => 'encerrada',
                $occupied >= $this->capacity => 'sem-vagas',
                default => 'aberta',
            },
            'banner' => $this->banner,
            'galeria' => $this->gallery ?? [],
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
            'updatedAt' => $this->updated_at?->toIso8601ZuluString(),
        ];
    }
}
