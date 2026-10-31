<?php

namespace App\Http\Controllers;

use App\Http\Resources\GuideResource;
use App\Models\Guide;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GuideController extends Controller
{
    /**
     * Published items, filtered and paginated.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'categoria' => ['nullable', 'string', 'max:100'],
            'pageSize' => ['nullable', 'integer', 'between:1,50'],
        ]);

        $items = Guide::query()
            ->published()
            ->when($request->filled('search'), function ($query) use ($request): void {
                $term = '%'.$request->string('search')->trim().'%';
                $query->where(fn ($query) => $query->where('title', 'like', $term)->orWhere('summary', 'like', $term));
            })
            ->when($request->filled('categoria'), fn ($query) => $query->where('category', $request->string('categoria')))
            ->orderBy('title')
            ->paginate($request->integer('pageSize', 12));

        return GuideResource::collection($items);
    }

    /**
     * A single published item.
     */
    public function show(Guide $guide): GuideResource
    {
        abort_unless($guide->status === 'published', 404);

        return new GuideResource($guide);
    }
}
