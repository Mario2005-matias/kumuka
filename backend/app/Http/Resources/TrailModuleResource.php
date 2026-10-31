<?php

namespace App\Http\Resources;

use App\Models\TrailModule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TrailModule
 */
class TrailModuleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...(new TrailModuleSummaryResource($this->resource))->toArray($request),
            'trailId' => (string) $this->trail_id,
            'aulas' => LessonResource::collection($this->whenLoaded('lessons')),
            'atividade' => $this->activity === null ? null : new ActivityResource($this->activity),
        ];
    }
}
