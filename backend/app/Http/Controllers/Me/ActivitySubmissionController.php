<?php

namespace App\Http\Controllers\Me;

use App\Enums\ActivityType;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivitySubmissionResource;
use App\Models\Activity;
use App\Services\TrailProgressService;
use Illuminate\Http\Request;

class ActivitySubmissionController extends Controller
{
    /**
     * Submit an activity. Quizzes are graded on the server and may be retried.
     */
    public function store(Request $request, Activity $activity, TrailProgressService $progress): ActivitySubmissionResource
    {
        $validated = $request->validate(match ($activity->type) {
            ActivityType::Quiz => ['answers' => ['required', 'array'], 'answers.*' => ['string', 'max:100']],
            ActivityType::Link => ['answer' => ['required', 'url:http,https', 'max:2048']],
            ActivityType::Upload => [
                'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp,doc,docx', 'max:5120'],
                'answer' => ['nullable', 'string', 'max:2000'],
            ],
            ActivityType::Writing => ['answer' => ['required', 'string', 'min:20', 'max:20000']],
        });

        abort_unless($progress->canAccessModule($request->user(), $activity->module), 403, __('Este módulo ainda está bloqueado.'));

        $submission = $progress->submit(
            $request->user(),
            $activity,
            $validated['answers'] ?? $validated['answer'] ?? null,
            $request->file('file'),
        );

        return new ActivitySubmissionResource($submission);
    }
}
