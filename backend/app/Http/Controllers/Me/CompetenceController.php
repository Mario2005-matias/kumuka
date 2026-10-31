<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CompetenceController extends Controller
{
    /**
     * Competences declared in the profile plus those proven by completed trails.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $proven = $user->enrollments()
            ->whereNotNull('completed_at')
            ->with('trail:id,core_competence')
            ->get()
            ->pluck('trail.core_competence');

        $competences = collect($user->profile?->competences ?? [])
            ->merge($proven)
            ->filter()
            ->unique()
            ->values()
            ->map(fn (string $name): array => ['id' => Str::slug($name), 'nome' => $name]);

        return response()->json(['data' => $competences]);
    }
}
