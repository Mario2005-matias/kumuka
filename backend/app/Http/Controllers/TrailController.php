<?php

namespace App\Http\Controllers;

use App\Http\Resources\TrailResource;
use App\Models\Trail;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TrailController extends Controller
{
    /**
     * Published trails, filtered and paginated.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'nivel' => ['nullable', 'in:iniciante,intermedio,avancado'],
            'categoria' => ['nullable', 'string', 'max:100'],
            'duracao' => ['nullable', 'in:menos-5,5-10,mais-10'],
            'pageSize' => ['nullable', 'integer', 'between:1,50'],
        ]);

        $trails = Trail::query()
            ->published()
            ->withCount(['phases', 'modules'])
            ->when($request->filled('search'), function ($query) use ($request): void {
                $term = '%'.$request->string('search')->trim().'%';
                $query->where(fn ($query) => $query->where('title', 'like', $term)->orWhere('summary', 'like', $term)->orWhere('category', 'like', $term));
            })
            ->when($request->filled('nivel'), fn ($query) => $query->where('level', $request->string('nivel')))
            ->when($request->filled('categoria'), fn ($query) => $query->where('category', $request->string('categoria')))
            ->when($request->string('duracao')->toString() === 'menos-5', fn ($query) => $query->where('duration_minutes', '<', 300))
            ->when($request->string('duracao')->toString() === '5-10', fn ($query) => $query->whereBetween('duration_minutes', [300, 600]))
            ->when($request->string('duracao')->toString() === 'mais-10', fn ($query) => $query->where('duration_minutes', '>', 600))
            ->orderBy('title')
            ->paginate($request->integer('pageSize', 12));

        return TrailResource::collection($trails);
    }

    /**
     * A published trail with its phases and module outline.
     */
    public function show(Trail $trail): TrailResource
    {
        abort_unless($trail->status === 'published', 404);

        return new TrailResource($trail->load([
            'phases',
            'modules' => fn ($query) => $query->withCount('lessons')->with('activity'),
        ]));
    }
}
