<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\Achievement;
use App\Services\AchievementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Request keys the student can edit, mapped to profile columns.
     *
     * @var array<string, string>
     */
    private const EDITABLE_FIELDS = [
        'nome' => 'name',
        'idade' => 'age',
        'situacao' => 'situation',
        'localizacao' => 'location',
        'interesses' => 'interests',
        'objetivo' => 'goal',
        'bio' => 'bio',
        'linkedin' => 'linkedin_url',
        'portfolio' => 'portfolio_url',
    ];

    /**
     * The student's profile.
     */
    public function show(Request $request): ProfileResource
    {
        return new ProfileResource($request->user()->profile()->firstOrCreate());
    }

    /**
     * Update profile details and, during onboarding, the step reached.
     *
     * Onboarding answers are saved step by step so the student can resume on any device.
     */
    public function update(Request $request, AchievementService $achievements): JsonResponse
    {
        $validated = $request->validate([
            'nome' => ['sometimes', 'nullable', 'string', 'max:120'],
            'idade' => ['sometimes', 'nullable', 'integer', 'between:10,99'],
            'situacao' => ['sometimes', 'nullable', 'string', 'max:120'],
            'localizacao' => ['sometimes', 'nullable', 'string', 'max:120'],
            'interesses' => ['sometimes', 'array', 'max:12'],
            'interesses.*' => ['string', 'max:60'],
            'objetivo' => ['sometimes', 'nullable', 'string', 'max:160'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'linkedin' => ['sometimes', 'nullable', 'url:http,https', 'max:2048'],
            'portfolio' => ['sometimes', 'nullable', 'url:http,https', 'max:2048'],
            'onboardingStep' => ['sometimes', 'integer', 'between:0,20'],
            'onboardingCompleted' => ['sometimes', 'accepted'],
        ]);

        $profile = $request->user()->profile()->firstOrCreate();

        foreach (self::EDITABLE_FIELDS as $key => $column) {
            if (array_key_exists($key, $validated)) {
                $profile->{$column} = $validated[$key];
            }
        }

        if (isset($validated['onboardingStep'])) {
            $profile->onboarding_step = max($profile->onboarding_step, $validated['onboardingStep']);
        }

        if (array_key_exists('nome', $validated)) {
            $request->user()->update(['name' => $validated['nome']]);
        }

        if (($validated['onboardingCompleted'] ?? false) && $profile->onboarding_completed_at === null) {
            $profile->onboarding_completed_at = now();
            $achievements->unlock($request->user(), Achievement::PROFILE_COMPLETED);
        }

        $profile->save();

        return (new ProfileResource($profile))->response()->setStatusCode(200);
    }
}
