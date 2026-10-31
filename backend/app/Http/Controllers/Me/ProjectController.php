<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Achievement;
use App\Models\Project;
use App\Services\AchievementService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
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
        $validated = $request->validate(self::rules());

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

    /**
     * Edit one of the student's projects.
     */
    public function update(Request $request, Project $project): ProjectResource
    {
        abort_unless($project->user_id === $request->user()->id, 404);

        $validated = $request->validate(self::rules());

        $project->update([
            'title' => $validated['titulo'],
            'description' => $validated['descricao'],
            'type' => $validated['tipo'],
            'link' => $validated['link'] ?? null,
            'competences' => $validated['competencias'] ?? [],
        ]);

        return new ProjectResource($project);
    }

    /**
     * Remove one of the student's projects.
     */
    public function destroy(Request $request, Project $project): Response
    {
        abort_unless($project->user_id === $request->user()->id, 404);

        $project->delete();

        return response()->noContent();
    }

    /**
     * @return array<string, array<int, string>>
     */
    private static function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:160'],
            'descricao' => ['required', 'string', 'max:2000'],
            'tipo' => ['required', 'in:tecnico,criativo'],
            'link' => ['nullable', 'url:http,https', 'max:2048'],
            'competencias' => ['nullable', 'array', 'max:10'],
            'competencias.*' => ['string', 'max:60'],
        ];
    }
}
