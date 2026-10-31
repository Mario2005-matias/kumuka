<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\AchievementResource;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AchievementController extends Controller
{
    /**
     * Every achievement, flagged with whether the student has unlocked it.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $achievements = Achievement::query()
            ->addSelect(['unlocked_at' => $request->user()->achievements()
                ->getQuery()
                ->select('achievement_user.unlocked_at')
                ->whereColumn('achievement_user.achievement_id', 'achievements.id')
                ->limit(1),
            ])
            ->orderBy('id')
            ->get();

        return AchievementResource::collection($achievements);
    }
}
