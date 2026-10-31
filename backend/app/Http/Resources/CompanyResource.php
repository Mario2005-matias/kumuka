<?php

namespace App\Http\Resources;

use App\Models\Company;
use App\Support\PublicFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Company
 */
class CompanyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'nome' => $this->name,
            'logo' => PublicFile::url($this->logo),
            'descricao' => $this->description,
            'area' => $this->area,
            'website' => $this->website,
            'cultura' => $this->culture,
            'status' => $this->status,
            'criadoEm' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
