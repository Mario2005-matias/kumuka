<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\Lesson;
use App\Models\LessonBlock;
use App\Models\LessonBlockProgress;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;
use App\Models\Trail;
use App\Models\TrailEnrollment;
use App\Models\TrailModule;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Decides, on the server, when lessons, modules and trails count as completed.
 *
 * Progress is based on evidence of learning, not on time spent on a page:
 * - a lesson is done when its videos were actually watched and its checkpoint was answered correctly;
 * - a module is done when its lessons are done, its quiz is passed and its required task is submitted;
 * - mastery is the average of the best quiz scores across the trail's modules.
 */
class TrailProgressService
{
    /**
     * Longest gap between video heartbeats that still counts as continuous playback.
     */
    public const MAX_HEARTBEAT_GAP_SECONDS = 30;

    /**
     * Fastest playback rate accepted when crediting watched video.
     */
    public const MAX_PLAYBACK_RATE = 2;

    public function __construct(private AchievementService $achievements) {}

    /**
     * Enroll the user in the trail, or return the existing enrollment.
     */
    public function enroll(User $user, Trail $trail): TrailEnrollment
    {
        return $user->enrollments()->firstOrCreate(
            ['trail_id' => $trail->id],
            [
                'current_module_id' => $trail->modules()->value('id'),
                'started_at' => now(),
                'last_activity_at' => now(),
            ],
        );
    }

    /**
     * Find the user's enrollment in the trail, if any.
     */
    public function enrollment(User $user, Trail $trail): ?TrailEnrollment
    {
        return $user->enrollments()->where('trail_id', $trail->id)->first();
    }

    /**
     * Identifiers of the modules the user may open.
     *
     * Sequential trails unlock a module only after the previous one is completed.
     *
     * @return list<int>
     */
    public function accessibleModuleIds(User $user, Trail $trail): array
    {
        $modules = $trail->modules()->pluck('id')->map(fn (mixed $id): int => (int) $id);

        if (! $trail->is_sequential) {
            return $modules->all();
        }

        $completed = $this->completedModuleIds($user, $modules);
        $accessible = [];

        foreach ($modules as $index => $moduleId) {
            if ($index === 0 || in_array($modules[$index - 1], $completed, true)) {
                $accessible[] = $moduleId;
            }
        }

        return $accessible;
    }

    /**
     * Whether the user is enrolled and allowed to work on the module.
     */
    public function canAccessModule(User $user, TrailModule $module): bool
    {
        return $this->enrollment($user, $module->trail) !== null
            && in_array($module->id, $this->accessibleModuleIds($user, $module->trail), true);
    }

    /**
     * Record playback of a video block.
     *
     * Only segments played continuously are credited, so seeking ahead does not count.
     *
     * @param  array{position: int|float}  $signal
     */
    public function recordVideoHeartbeat(User $user, LessonBlock $block, array $signal): LessonBlockProgress
    {
        $progress = $user->blockProgress()->firstOrNew(['lesson_block_id' => $block->id]);
        $now = now();
        $position = max(0, (int) floor($signal['position']));

        $elapsed = $progress->last_heartbeat_at?->diffInSeconds($now);
        $previous = $progress->last_position_seconds;
        $segments = str_pad((string) $progress->watched_segments, $block->segmentCount(), '0');

        if ($elapsed !== null && $elapsed >= 0 && $elapsed <= self::MAX_HEARTBEAT_GAP_SECONDS && $previous !== null) {
            $advanced = $position - $previous;

            if ($advanced > 0 && $advanced <= $elapsed * self::MAX_PLAYBACK_RATE + 2) {
                $first = intdiv($previous, LessonBlock::SEGMENT_SECONDS);
                $last = min($block->segmentCount() - 1, max($first, (int) ceil($position / LessonBlock::SEGMENT_SECONDS) - 1));

                for ($index = $first; $index <= $last; $index++) {
                    $segments[$index] = '1';
                }
            }
        }

        $progress->fill([
            'watched_segments' => $segments,
            'last_position_seconds' => $position,
            'last_heartbeat_at' => $now,
        ]);

        $justCompleted = $progress->completed_at === null
            && $this->watchedPercent($block, $progress) >= $block->lesson->completion_threshold;

        if ($justCompleted) {
            $progress->completed_at = $now;
        }

        $progress->save();

        if ($justCompleted) {
            $this->evaluateLesson($user, $block->lesson);
        } else {
            $this->touchEnrollment($user, $block->lesson->module);
        }

        return $progress;
    }

    /**
     * Share (0-100) of a video block that has actually been watched.
     */
    public function watchedPercent(LessonBlock $block, ?LessonBlockProgress $progress): int
    {
        if ($progress === null) {
            return 0;
        }

        return (int) floor(substr_count((string) $progress->watched_segments, '1') / $block->segmentCount() * 100);
    }

    /**
     * Mark a lesson that has nothing to watch or answer as read.
     *
     * Lessons with a tracked video or a checkpoint can only be completed through them.
     */
    public function markLessonRead(User $user, Lesson $lesson): bool
    {
        if ($this->lessonNeedsEvidence($lesson)) {
            return false;
        }

        $this->completeLesson($user, $lesson);

        return true;
    }

    /**
     * Complete the lesson when its videos were watched and its checkpoint was passed.
     */
    public function evaluateLesson(User $user, Lesson $lesson): bool
    {
        $missing = $this->missingLessonRequirements($user, $lesson);

        if (! $this->lessonNeedsEvidence($lesson) || $missing['videos'] !== [] || $missing['checkpoint']) {
            $this->touchEnrollment($user, $lesson->module);

            return false;
        }

        $this->completeLesson($user, $lesson);

        return true;
    }

    /**
     * Requirements still missing before the lesson counts as completed.
     *
     * @return array{videos: list<int>, checkpoint: bool}
     */
    public function missingLessonRequirements(User $user, Lesson $lesson): array
    {
        $videoIds = $lesson->blocks()->get()->filter->isTracked()->pluck('id');
        $watchedIds = $user->blockProgress()->whereIn('lesson_block_id', $videoIds)->whereNotNull('completed_at')->pluck('lesson_block_id');

        $checkpointMissing = $lesson->checkpointQuestions()->exists()
            && ! $user->quizAttempts()->where('lesson_id', $lesson->id)->where('passed', true)->exists();

        return [
            'videos' => $videoIds->diff($watchedIds)->values()->all(),
            'checkpoint' => $checkpointMissing,
        ];
    }

    /**
     * Whether the lesson has a video or a checkpoint that proves it was followed.
     */
    public function lessonNeedsEvidence(Lesson $lesson): bool
    {
        return $lesson->checkpointQuestions()->exists()
            || $lesson->blocks()->get()->contains->isTracked();
    }

    /**
     * Store an unsubmitted answer so the student can resume later.
     */
    public function saveDraft(User $user, Activity $activity, string $answer): ActivitySubmission
    {
        $submission = $user->activitySubmissions()->firstOrNew(['activity_id' => $activity->id]);
        $submission->answer = $answer;
        $submission->save();

        $this->touchEnrollment($user, $activity->module);

        return $submission;
    }

    /**
     * Submit a practical task.
     */
    public function submitActivity(User $user, Activity $activity, ?string $answer, ?UploadedFile $file = null): ActivitySubmission
    {
        $submission = $user->activitySubmissions()->firstOrNew(['activity_id' => $activity->id]);

        if ($file !== null) {
            $submission->file_path = $file->store("activity-submissions/{$user->id}");
        }

        $submission->answer = $answer;
        $submission->attempts++;
        $submission->submitted_at = now();
        $submission->passed_at ??= now();
        $submission->save();

        $this->achievements->unlock($user, Achievement::FIRST_ACTIVITY);
        $this->evaluateModule($user, $activity->module);

        return $submission;
    }

    /**
     * Mark the module as completed when every requirement is met, then refresh the trail progress.
     */
    public function evaluateModule(User $user, TrailModule $module): bool
    {
        $missing = $this->missingModuleRequirements($user, $module);
        $isComplete = $missing['lessons'] === [] && ! $missing['quiz'] && ! $missing['activity'];

        DB::transaction(function () use ($user, $module, $isComplete): void {
            if ($isComplete) {
                $user->moduleCompletions()->firstOrCreate(
                    ['trail_module_id' => $module->id],
                    ['completed_at' => now()],
                );
            }

            $this->refreshEnrollment($user, $module->trail);
        });

        return $isComplete;
    }

    /**
     * Requirements still missing before the module counts as completed.
     *
     * @return array{lessons: list<int>, quiz: bool, activity: bool}
     */
    public function missingModuleRequirements(User $user, TrailModule $module): array
    {
        $requiredLessonIds = $module->lessons()->where('is_required', true)->pluck('id');
        $completedLessonIds = $user->lessonProgress()
            ->whereIn('lesson_id', $requiredLessonIds)
            ->whereNotNull('completed_at')
            ->pluck('lesson_id');

        $quizMissing = $module->quizQuestions()->exists() && ! $this->hasPassedQuiz($user, $module);

        $activity = $module->activity;
        $activityMissing = $activity !== null
            && $activity->is_required
            && ! $user->activitySubmissions()->where('activity_id', $activity->id)->whereNotNull('passed_at')->exists();

        return [
            'lessons' => $requiredLessonIds->diff($completedLessonIds)->values()->all(),
            'quiz' => $quizMissing,
            'activity' => $activityMissing,
        ];
    }

    /**
     * Whether every required lesson of the module is completed, which unlocks its quiz.
     */
    public function lessonsCompleted(User $user, TrailModule $module): bool
    {
        return $this->missingModuleRequirements($user, $module)['lessons'] === [];
    }

    public function hasPassedQuiz(User $user, TrailModule $module): bool
    {
        return $user->quizAttempts()
            ->where('trail_module_id', $module->id)
            ->whereNull('lesson_id')
            ->where('passed', true)
            ->exists();
    }

    /**
     * Best module quiz score of the user, if they attempted it.
     */
    public function bestQuizScore(User $user, TrailModule $module): ?int
    {
        $score = $user->quizAttempts()
            ->where('trail_module_id', $module->id)
            ->whereNull('lesson_id')
            ->whereNotNull('submitted_at')
            ->max('score');

        return $score === null ? null : (int) $score;
    }

    /**
     * @param  Collection<int, int>  $moduleIds
     * @return list<int>
     */
    public function completedModuleIds(User $user, Collection $moduleIds): array
    {
        return $user->moduleCompletions()
            ->whereIn('trail_module_id', $moduleIds)
            ->pluck('trail_module_id')
            ->map(fn (mixed $id): int => (int) $id)
            ->all();
    }

    /**
     * Recalculate progress, mastery, current module and completion of the user's enrollment.
     *
     * Progress counts completed lessons, passed quizzes and submitted required tasks.
     * Mastery averages the best quiz score of every module that has a quiz.
     */
    public function refreshEnrollment(User $user, Trail $trail): void
    {
        $enrollment = $this->enrollment($user, $trail);

        if ($enrollment === null) {
            return;
        }

        $modules = $trail->modules()->with('activity')->withCount('quizQuestions')->get();
        $moduleIds = $modules->pluck('id')->map(fn (mixed $id): int => (int) $id);
        $completedModules = $this->completedModuleIds($user, $moduleIds);

        $requiredLessonIds = Lesson::query()->whereIn('trail_module_id', $moduleIds)->where('is_required', true)->pluck('id');
        $requiredActivityIds = $modules->pluck('activity')->filter(fn (?Activity $activity): bool => $activity?->is_required ?? false)->pluck('id');
        $quizModuleIds = $modules->where('quiz_questions_count', '>', 0)->pluck('id');

        $quizAttempts = QuizAttempt::query()
            ->where('user_id', $user->id)
            ->whereIn('trail_module_id', $quizModuleIds)
            ->whereNull('lesson_id')
            ->whereNotNull('submitted_at')
            ->get(['trail_module_id', 'score', 'passed'])
            ->groupBy('trail_module_id');

        $passedQuizzes = $quizAttempts->filter(fn (Collection $attempts): bool => $attempts->contains('passed', true))->count();
        $bestScoreSum = $quizAttempts->sum(fn (Collection $attempts): int => (int) $attempts->max('score'));

        $done = LessonProgress::query()->where('user_id', $user->id)->whereIn('lesson_id', $requiredLessonIds)->whereNotNull('completed_at')->count()
            + $passedQuizzes
            + ActivitySubmission::query()->where('user_id', $user->id)->whereIn('activity_id', $requiredActivityIds)->whereNotNull('passed_at')->count();
        $total = $requiredLessonIds->count() + $quizModuleIds->count() + $requiredActivityIds->count();

        $isTrailComplete = $modules->isNotEmpty() && count($completedModules) === $modules->count();
        $nextModuleId = $moduleIds->first(fn (int $id): bool => ! in_array($id, $completedModules, true));

        $enrollment->fill([
            'percent' => $isTrailComplete ? 100 : ($total === 0 ? 0 : (int) min(99, floor($done / $total * 100))),
            'mastery' => $quizModuleIds->isEmpty() ? 0 : (int) round($bestScoreSum / $quizModuleIds->count()),
            'current_module_id' => $nextModuleId ?? $moduleIds->last(),
            'last_activity_at' => now(),
        ]);

        if ($isTrailComplete && $enrollment->completed_at === null) {
            $enrollment->completed_at = now();
            $this->achievements->unlock($user, Achievement::FIRST_LEARNING);
            $this->achievements->unlock($user, Achievement::FIRST_TRAIL);

            if ($trail->has_certificate) {
                $this->achievements->unlock($user, Achievement::FIRST_CERTIFICATE);
            }
        }

        $enrollment->save();
    }

    private function completeLesson(User $user, Lesson $lesson): void
    {
        $user->lessonProgress()->firstOrCreate(['lesson_id' => $lesson->id], ['completed_at' => now()]);
        $this->evaluateModule($user, $lesson->module);
    }

    private function touchEnrollment(User $user, TrailModule $module): void
    {
        $user->enrollments()
            ->where('trail_id', $module->trail_id)
            ->update(['last_activity_at' => now(), 'current_module_id' => $module->id]);
    }
}
