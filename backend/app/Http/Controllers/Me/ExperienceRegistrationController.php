<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceRegistrationResource;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ExperienceRegistrationController extends Controller
{
    /**
     * Experiences the student registered for.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        return ExperienceRegistrationResource::collection($request->user()->experienceRegistrations()->latest()->get());
    }

    /**
     * Register for an experience while seats are available.
     */
    public function store(Request $request): ExperienceRegistrationResource
    {
        $validated = $request->validate(['experienceId' => ['required', 'integer', 'exists:experiences,id']]);

        $registration = DB::transaction(function () use ($request, $validated) {
            $experience = Experience::query()->lockForUpdate()->findOrFail($validated['experienceId']);
            $existing = $request->user()->experienceRegistrations()->where('experience_id', $experience->id)->first();

            if ($existing !== null && $existing->status !== 'cancelado') {
                return $existing;
            }

            if (! $experience->acceptsRegistrations()) {
                throw ValidationException::withMessages(['experienceId' => __('As inscrições para esta experiência estão fechadas.')]);
            }

            return $request->user()->experienceRegistrations()->updateOrCreate(
                ['experience_id' => $experience->id],
                ['status' => 'inscrito'],
            );
        });

        return new ExperienceRegistrationResource($registration);
    }
}
