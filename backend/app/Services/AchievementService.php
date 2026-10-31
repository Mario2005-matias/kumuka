<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;

class AchievementService
{
    /**
     * Unlock the achievement identified by the given code, once per user.
     */
    public function unlock(User $user, string $code): void
    {
        $achievement = Achievement::query()->where('code', $code)->first();

        if ($achievement === null || $user->achievements()->whereKey($achievement->id)->exists()) {
            return;
        }

        $user->achievements()->attach($achievement->id, ['unlocked_at' => now()]);
    }
}
