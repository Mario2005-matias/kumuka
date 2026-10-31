<?php

namespace App\Http\Controllers;

use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExperienceController extends Controller
{
    /**
     * Experiences, filtered and paginated, soonest first.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'tipo' => ['nullable', 'string', 'max:50'],
            'modalidade' => ['nullable', 'in:presencial,online,hibrido'],
            'periodo' => ['nullable', 'in:semana,mes,tres-meses'],
            'localizacao' => ['nullable', 'string', 'max:100'],
            'pageSize' => ['nullable', 'integer', 'between:1,50'],
        ]);

        $periods = ['semana' => now()->addWeek(), 'mes' => now()->addMonth(), 'tres-meses' => now()->addMonths(3)];

        $experiences = $this->withStudentState(Experience::query(), $request)
            ->when($request->filled('search'), function ($query) use ($request): void {
                $term = '%'.$request->string('search')->trim().'%';
                $query->where(fn ($query) => $query->where('title', 'like', $term)->orWhere('summary', 'like', $term));
            })
            ->when($request->filled('tipo'), fn ($query) => $query->where('type', $request->string('tipo')))
            ->when($request->filled('modalidade'), fn ($query) => $query->where('modality', $request->string('modalidade')))
            ->when($request->filled('localizacao'), fn ($query) => $query->where('location', 'like', '%'.$request->string('localizacao').'%'))
            ->when($request->filled('periodo'), fn ($query) => $query->whereBetween('starts_at', [now()->startOfDay(), $periods[$request->string('periodo')->toString()]]))
            ->orderBy('starts_at')
            ->paginate($request->integer('pageSize', 12));

        return ExperienceResource::collection($experiences);
    }

    /**
     * A single experience.
     */
    public function show(Request $request, Experience $experience): ExperienceResource
    {
        $experience = $this->withStudentState(Experience::query(), $request)->findOrFail($experience->id);

        return new ExperienceResource($experience);
    }

    /**
     * @param  Builder<Experience>  $query
     * @return Builder<Experience>
     */
    private function withStudentState(Builder $query, Request $request): Builder
    {
        return $query
            ->withCount(['registrations as active_registrations_count' => fn ($query) => $query->where('status', '!=', 'cancelado')])
            ->withExists(['registrations as is_registered' => fn ($query) => $query
                ->where('user_id', $request->user()->id)
                ->where('status', '!=', 'cancelado')]);
    }
}
