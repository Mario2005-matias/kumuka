<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivitySubmissionResource;
use App\Models\Activity;
use App\Services\TrailProgressService;
use Illuminate\Http\Request;

class ActivityDraftController extends Controller
{
    /**
     * Save an unsubmitted answer.
     */
    public function update(Request $request, Activity $activity, TrailProgressService $progress): ActivitySubmissionResource
    {
        $validated = $request->validate(['answer' => ['present', 'nullable', 'string', 'max:20000']]);

        abort_unless($progress->canAccessModule($request->user(), $activity->module), 403, __('Este módulo ainda está bloqueado.'));

        return new ActivitySubmissionResource($progress->saveDraft($request->user(), $activity, (string) $validated['answer']));
    }
}
