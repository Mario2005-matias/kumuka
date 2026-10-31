<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Achievement;
use App\Services\AchievementService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Portfolio projects of the student.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        return ProjectResource::collection($request->user()->projects()->latest()->get());
    }

    /**
     * Add a project to the portfolio.
     */
    public function store(Request $request, AchievementService $achievements): ProjectResource
    {
        $validated = $request->validate([
            'titulo' => ['required', 'string', 'max:160'],
            'descricao' => ['required', 'string', 'max:2000'],
            'tipo' => ['required', 'in:tecnico,criativo'],
            'link' => ['nullable', 'url:http,https', 'max:2048'],
            'competencias' => ['nullable', 'array', 'max:10'],
            'competencias.*' => ['string', 'max:60'],
        ]);

        $project = $request->user()->projects()->create([
            'slug' => Str::slug($validated['titulo']).'-'.Str::lower(Str::random(5)),
            'title' => $validated['titulo'],
            'description' => $validated['descricao'],
            'type' => $validated['tipo'],
            'link' => $validated['link'] ?? null,
            'competences' => $validated['competencias'] ?? [],
        ]);

        $achievements->unlock($request->user(), Achievement::FIRST_PROJECT);

        return new ProjectResource($project);
    }
}
