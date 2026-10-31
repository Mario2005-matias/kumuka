<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Activity
 */
class ActivityResource extends JsonResource
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
            'enunciado' => $this->prompt,
            'instrucoes' => $this->instructions ?? '',
            'obrigatoria' => $this->is_required,
            'pontos' => $this->points,
        ];
    }
}
