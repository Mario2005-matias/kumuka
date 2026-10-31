<?php

namespace App\Http\Controllers;

use App\Http\Resources\OpportunityResource;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OpportunityController extends Controller
{
    /**
     * Opportunities, filtered and paginated, soonest deadline first.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'tipo' => ['nullable', 'string', 'max:50'],
            'area' => ['nullable', 'string', 'max:100'],
            'empresa' => ['nullable', 'string', 'max:100'],
            'localizacao' => ['nullable', 'string', 'max:100'],
            'modalidade' => ['nullable', 'in:presencial,online,hibrido'],
            'prazo' => ['nullable', 'in:semana,mes,tres-meses'],
            'pageSize' => ['nullable', 'integer', 'between:1,50'],
        ]);

        $deadlines = ['semana' => now()->addWeek(), 'mes' => now()->addMonth(), 'tres-meses' => now()->addMonths(3)];

        $opportunities = Opportunity::query()
            ->with('company')
            ->when($request->filled('search'), function ($query) use ($request): void {
                $term = '%'.$request->string('search')->trim().'%';
                $query->where(fn ($query) => $query->where('title', 'like', $term)->orWhere('summary', 'like', $term)->orWhere('area', 'like', $term));
            })
            ->when($request->filled('tipo'), fn ($query) => $query->where('type', $request->string('tipo')))
            ->when($request->filled('area'), fn ($query) => $query->where('area', $request->string('area')))
            ->when($request->filled('empresa'), fn ($query) => $query->whereHas('company', fn ($query) => $query->where('name', $request->string('empresa'))))
            ->when($request->filled('localizacao'), fn ($query) => $query->where('location', 'like', '%'.$request->string('localizacao').'%'))
            ->when($request->filled('modalidade'), fn ($query) => $query->where('modality', $request->string('modalidade')))
            ->when($request->filled('prazo'), fn ($query) => $query->whereBetween('deadline_at', [now(), $deadlines[$request->string('prazo')->toString()]]))
            ->orderBy('deadline_at')
            ->paginate($request->integer('pageSize', 12));

        return OpportunityResource::collection($opportunities);
    }

    /**
     * A single opportunity.
     */
    public function show(Opportunity $opportunity): OpportunityResource
    {
        return new OpportunityResource($opportunity->load('company'));
    }
}
