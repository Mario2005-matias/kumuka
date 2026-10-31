<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\LessonProgressResource;
use App\Models\Lesson;
use App\Services\TrailProgressService;
use Illuminate\Http\Request;

class LessonHeartbeatController extends Controller
{
    /**
     * Record that the student is actively following a lesson.
     *
     * Clients send a heartbeat roughly every ten seconds while the lesson is visible,
     * plus "opened" when a link lesson is opened and "ended" when a video finishes.
     */
    public function store(Request $request, Lesson $lesson, TrailProgressService $progress): LessonProgressResource
    {
        $validated = $request->validate([
            'event' => ['required', 'in:progress,opened,ended'],
            'position' => ['nullable', 'numeric', 'min:0', 'max:86400'],
            'reachedEnd' => ['nullable', 'boolean'],
        ]);

        abort_unless($progress->canAccessModule($request->user(), $lesson->module), 403, __('Este módulo ainda está bloqueado.'));

        $lessonProgress = $progress->recordHeartbeat($request->user(), $lesson, [
            'event' => $validated['event'],
            'position' => $validated['position'] ?? null,
            'reached_end' => $validated['reachedEnd'] ?? null,
        ]);

        return new LessonProgressResource($lessonProgress->load('lesson'));
    }
}
