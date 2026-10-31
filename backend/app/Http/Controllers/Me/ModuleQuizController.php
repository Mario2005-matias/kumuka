<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuizAttemptResource;
use App\Models\QuizAttempt;
use App\Models\TrailModule;
use App\Services\QuizService;
use App\Services\TrailProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleQuizController extends Controller
{
    public function __construct(
        private QuizService $quizzes,
        private TrailProgressService $progress,
    ) {}

    /**
     * Whether the quiz is unlocked, the best score so far and when the next attempt is allowed.
     */
    public function show(Request $request, TrailModule $module): JsonResponse
    {
        $user = $request->user();
        abort_unless($this->progress->canAccessModule($user, $module), 403, __('Este módulo ainda está bloqueado.'));

        $attempts = $user->quizAttempts()->where('trail_module_id', $module->id)->whereNull('lesson_id');

        return response()->json(['data' => [
            'moduleId' => (string) $module->id,
            'perguntas' => min($module->quizQuestions()->count(), $module->quiz_question_count),
            'notaMinima' => $module->quiz_passing_score,
            'desbloqueado' => $this->progress->lessonsCompleted($user, $module),
            'aprovado' => $this->progress->hasPassedQuiz($user, $module),
            'melhorNota' => $this->progress->bestQuizScore($user, $module),
            'tentativas' => (clone $attempts)->whereNotNull('submitted_at')->count(),
            'tentativaAbertaId' => (clone $attempts)->whereNull('submitted_at')->latest()->value('id'),
            'disponivelEm' => $this->quizzes->availableAt($user, $module)?->toIso8601ZuluString(),
        ]]);
    }

    /**
     * Start a new attempt (or resume the open one) with questions drawn from the bank.
     */
    public function store(Request $request, TrailModule $module): QuizAttemptResource
    {
        abort_unless($this->progress->canAccessModule($request->user(), $module), 403, __('Este módulo ainda está bloqueado.'));

        return new QuizAttemptResource($this->quizzes->startModuleQuiz($request->user(), $module));
    }

    /**
     * Submit the answers of an attempt and get feedback for every question.
     */
    public function submit(Request $request, QuizAttempt $attempt): QuizAttemptResource
    {
        abort_unless($attempt->user_id === $request->user()->id && $attempt->lesson_id === null, 404);
        $validated = $request->validate(['answers' => ['present', 'array']]);

        return new QuizAttemptResource($this->quizzes->submitModuleQuiz($request->user(), $attempt, $validated['answers']));
    }
}
