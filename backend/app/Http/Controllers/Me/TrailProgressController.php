<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivitySubmissionResource;
use App\Http\Resources\LessonProgressResource;
use App\Http\Resources\TrailEnrollmentResource;
use App\Models\Trail;
use App\Services\TrailProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TrailProgressController extends Controller
{
    public function __construct(private TrailProgressService $progress) {}

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
        $modules = $trail->modules()->with(['lessons', 'activity'])->get();

        if ($enrollment === null) {
            return [
                'trailId' => (string) $trail->id,
                'estado' => 'nao_iniciado',
                'percentual' => 0,
                'moduloAtualId' => $modules->first()?->id === null ? null : (string) $modules->first()->id,
                'modulosConcluidos' => [],
                'modulosAcessiveis' => [],
                'aulas' => (object) [],
                'atividades' => (object) [],
                'iniciadoEm' => null,
                'atualizadoEm' => null,
                'concluidoEm' => null,
            ];
        }

        $lessonIds = $modules->flatMap->lessons->pluck('id');
        $activityIds = $modules->pluck('activity')->filter()->pluck('id');

        $lessonProgress = $user->lessonProgress()->with('lesson')->whereIn('lesson_id', $lessonIds)->get();
        $submissions = $user->activitySubmissions()->whereIn('activity_id', $activityIds)->get();

        return [
            ...(new TrailEnrollmentResource($enrollment))->toArray($request),
            'modulosConcluidos' => array_map('strval', $this->progress->completedModuleIds($user, $modules->pluck('id'))),
            'modulosAcessiveis' => array_map('strval', $this->progress->accessibleModuleIds($user, $trail)),
            'aulas' => (object) $lessonProgress->mapWithKeys(fn ($item) => [
                (string) $item->lesson_id => (new LessonProgressResource($item))->toArray($request),
            ])->all(),
            'atividades' => (object) $submissions->mapWithKeys(fn ($item) => [
                (string) $item->activity_id => (new ActivitySubmissionResource($item))->toArray($request),
            ])->all(),
        ];
    }
}
