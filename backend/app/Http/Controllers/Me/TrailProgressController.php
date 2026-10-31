<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivitySubmissionResource;
use App\Http\Resources\TrailEnrollmentResource;
use App\Models\LessonBlock;
use App\Models\Trail;
use App\Services\QuizService;
use App\Services\TrailProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TrailProgressController extends Controller
{
    public function __construct(
        private TrailProgressService $progress,
        private QuizService $quizzes,
    ) {}

    /**
     * Every trail the student has started, most recent first.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $enrollments = $request->user()->enrollments()
            ->with(['trail' => fn ($query) => $query->withCount(['phases', 'modules'])])
            ->latest('last_activity_at')
            ->get();

        return TrailEnrollmentResource::collection($enrollments);
    }

    /**
     * Detailed progress of the student in one trail.
     */
    public function show(Request $request, Trail $trail): JsonResponse
    {
        return response()->json(['data' => $this->snapshot($request, $trail)]);
    }

    /**
     * Enroll the student in the trail.
     */
    public function store(Request $request, Trail $trail): JsonResponse
    {
        abort_unless($trail->status === 'published', 404);

        $this->progress->enroll($request->user(), $trail);

        return response()->json(['data' => $this->snapshot($request, $trail)], 201);
    }

    /**
     * @return array<string, mixed>
     */
    private function snapshot(Request $request, Trail $trail): array
    {
        $user = $request->user();
        $enrollment = $this->progress->enrollment($user, $trail);
        $modules = $trail->modules()->with(['lessons.blocks', 'activity'])->withCount('quizQuestions')->get();

        if ($enrollment === null) {
            return [
                'trailId' => (string) $trail->id,
                'estado' => 'nao_iniciado',
                'percentual' => 0,
                'dominio' => 0,
                'moduloAtualId' => $modules->first()?->id === null ? null : (string) $modules->first()->id,
                'modulosConcluidos' => [],
                'modulosAcessiveis' => [],
                'aulas' => (object) [],
                'blocos' => (object) [],
                'quizzes' => (object) [],
                'atividades' => (object) [],
                'iniciadoEm' => null,
                'atualizadoEm' => null,
                'concluidoEm' => null,
            ];
        }

        $lessons = $modules->flatMap->lessons;
        $videoBlocks = $lessons->flatMap->blocks->filter->isTracked()->keyBy('id');

        $completedLessons = $user->lessonProgress()->whereIn('lesson_id', $lessons->pluck('id'))->whereNotNull('completed_at')->pluck('completed_at', 'lesson_id');
        $passedCheckpoints = $user->quizAttempts()->whereIn('lesson_id', $lessons->pluck('id'))->where('passed', true)->pluck('lesson_id')->flip();
        $blockProgress = $user->blockProgress()->whereIn('lesson_block_id', $videoBlocks->keys())->get();
        $submissions = $user->activitySubmissions()->whereIn('activity_id', $modules->pluck('activity')->filter()->pluck('id'))->get();

        return [
            ...(new TrailEnrollmentResource($enrollment))->toArray($request),
            'modulosConcluidos' => array_map('strval', $this->progress->completedModuleIds($user, $modules->pluck('id'))),
            'modulosAcessiveis' => array_map('strval', $this->progress->accessibleModuleIds($user, $trail)),
            'aulas' => (object) $lessons->mapWithKeys(fn ($lesson) => [(string) $lesson->id => [
                'concluida' => $completedLessons->has($lesson->id),
                'verificacaoAprovada' => $passedCheckpoints->has($lesson->id),
                'concluidaEm' => $completedLessons->get($lesson->id)?->toIso8601ZuluString(),
            ]])->all(),
            'blocos' => (object) $blockProgress->mapWithKeys(fn ($item) => [(string) $item->lesson_block_id => [
                'percentual' => $this->progress->watchedPercent($videoBlocks->get($item->lesson_block_id) ?? new LessonBlock, $item),
                'posicao' => $item->last_position_seconds,
                'concluido' => $item->completed_at !== null,
            ]])->all(),
            'quizzes' => (object) $modules->where('quiz_questions_count', '>', 0)->mapWithKeys(fn ($module) => [(string) $module->id => [
                'aprovado' => $this->progress->hasPassedQuiz($user, $module),
                'melhorNota' => $this->progress->bestQuizScore($user, $module),
                'disponivelEm' => $this->quizzes->availableAt($user, $module)?->toIso8601ZuluString(),
            ]])->all(),
            'atividades' => (object) $submissions->mapWithKeys(fn ($item) => [
                (string) $item->activity_id => (new ActivitySubmissionResource($item))->toArray($request),
            ])->all(),
        ];
    }
}
