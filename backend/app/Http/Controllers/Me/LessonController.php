<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuizAttemptResource;
use App\Models\Lesson;
use App\Services\QuizService;
use App\Services\TrailProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LessonController extends Controller
{
    public function __construct(private TrailProgressService $progress) {}

    /**
     * Mark a reading-only lesson (no video and no checkpoint) as read.
     */
    public function markRead(Request $request, Lesson $lesson): JsonResponse
    {
        $this->authorizeLesson($request, $lesson);

        if (! $this->progress->markLessonRead($request->user(), $lesson)) {
            throw ValidationException::withMessages([
                'lesson' => __('Esta lição conclui-se ao assistir ao vídeo e responder à verificação.'),
            ]);
        }

        return response()->json(['data' => ['lessonId' => (string) $lesson->id, 'concluida' => true]]);
    }

    /**
     * Answer the lesson checkpoint. Every answer must be correct; the student may retry at once.
     */
    public function checkpoint(Request $request, Lesson $lesson, QuizService $quizzes): QuizAttemptResource
    {
        $validated = $request->validate(['answers' => ['required', 'array']]);
        $this->authorizeLesson($request, $lesson);

        return new QuizAttemptResource($quizzes->submitCheckpoint($request->user(), $lesson, $validated['answers']));
    }

    private function authorizeLesson(Request $request, Lesson $lesson): void
    {
        abort_unless($this->progress->canAccessModule($request->user(), $lesson->module), 403, __('Este módulo ainda está bloqueado.'));
    }
}
