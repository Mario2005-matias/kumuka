<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\GuideResource;
use App\Http\Resources\QuickLearningResource;
use App\Http\Resources\TrailResource;
use App\Models\Guide;
use App\Models\QuickLearning;
use App\Models\Trail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    /**
     * Content suggestions based on the student's interests, skipping trails already started.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $interests = $user->profile?->interests ?? [];
        $startedTrailIds = $user->enrollments()->pluck('trail_id');

        $trails = Trail::query()
            ->published()
            ->withCount(['phases', 'modules'])
            ->whereNotIn('id', $startedTrailIds)
            ->when($interests !== [], fn ($query) => $query->orderByRaw(
                'case when category in ('.implode(',', array_fill(0, count($interests), '?')).') then 0 else 1 end',
                $interests,
            ))
            ->limit(3)
            ->get();

        $quickLearnings = QuickLearning::query()->published()->inRandomOrder()->limit(2)->get();
        $guides = Guide::query()->published()->inRandomOrder()->limit(1)->get();

        return response()->json(['data' => [
            ...$trails->map(fn (Trail $trail): array => ['tipo' => 'trail', 'item' => new TrailResource($trail)]),
            ...$quickLearnings->map(fn (QuickLearning $item): array => ['tipo' => 'quick-learning', 'item' => new QuickLearningResource($item)]),
            ...$guides->map(fn (Guide $item): array => ['tipo' => 'guide', 'item' => new GuideResource($item)]),
        ]]);
    }
}
