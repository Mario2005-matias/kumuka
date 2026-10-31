<?php

namespace App\Http\Resources;

use App\Models\OpportunityApplication;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OpportunityApplication
 */
class OpportunityApplicationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'opportunityId' => (string) $this->opportunity_id,
            'tipo' => $this->type,
            'estado' => $this->status,
            'registadoEm' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
