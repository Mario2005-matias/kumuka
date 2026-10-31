<?php

namespace App\Services;

use App\Enums\ActivityType;
use App\Enums\LessonType;
use App\Models\Achievement;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Trail;
use App\Models\TrailEnrollment;
use App\Models\TrailModule;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Tracks how a student actually follows a trail and decides, on the server,
 * when lessons, modules and the trail itself count as completed.
 */
class TrailProgressService
{
    /**
     * Longest gap between heartbeats that still counts as continuous engagement.
     */
    public const MAX_HEARTBEAT_GAP_SECONDS = 30;

    /**
     * Most engagement time credited by a single heartbeat.
     */
    public const MAX_CREDIT_PER_HEARTBEAT_SECONDS = 15;

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
     * Record a heartbeat sent while the student is on a lesson.
     *
     * @param  array{event: string, position?: int|float|null, reached_end?: bool|null}  $signal
     */
    public function recordHeartbeat(User $user, Lesson $lesson, array $signal): LessonProgress
    {
        $progress = $user->lessonProgress()->firstOrNew(['lesson_id' => $lesson->id]);
        $now = now();
        $position = isset($signal['position']) ? max(0, (int) floor($signal['position'])) : null;

        if ($progress->completed_at !== null) {
            $progress->fill(['last_position_seconds' => $position ?? $progress->last_position_seconds]);
            $progress->save();

            return $progress;
        }

        $elapsed = $progress->last_heartbeat_at?->diffInSeconds($now);
        $isContinuous = $elapsed !== null && $elapsed >= 0 && $elapsed <= self::MAX_HEARTBEAT_GAP_SECONDS;

        if ($isContinuous && $signal['event'] !== 'opened') {
            $progress->engaged_seconds += (int) min($elapsed, self::MAX_CREDIT_PER_HEARTBEAT_SECONDS);
        }

        match ($lesson->type) {
            LessonType::Text => $progress->reached_end = $progress->reached_end || (bool) ($signal['reached_end'] ?? false),
            LessonType::Image => $progress->reached_end = true,
            LessonType::Link => $progress->reached_end = $progress->reached_end || $signal['event'] === 'opened',
            LessonType::Video => $this->creditWatchedVideo($lesson, $progress, $position, $isContinuous ? (float) $elapsed : null),
        };

        $progress->last_heartbeat_at = $now;

        if ($this->lessonRequirementsMet($lesson, $progress)) {
            $progress->completed_at = $now;
        }

        $progress->save();

        if ($progress->completed_at !== null) {
            $this->evaluateModule($user, $lesson->module);
        } else {
            $this->touchEnrollment($user, $lesson->module);
        }

        return $progress;
    }

    /**
     * Share (0-100) of the lesson's completion requirement already met.
     */
    public function lessonPercent(Lesson $lesson, ?LessonProgress $progress): int
    {
        if ($progress === null) {
            return 0;
        }

        if ($progress->completed_at !== null) {
            return 100;
        }

        return match ($lesson->type) {
            LessonType::Video => (int) min(99, floor($this->watchedRatio($lesson, $progress) * 100 / max(1, $lesson->completion_threshold) * 100)),
            LessonType::Link => 0,
            default => (int) min(99, floor($progress->engaged_seconds / max(1, $lesson->requiredEngagedSeconds()) * 100)),
        };
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
     * Submit an activity answer, grading quizzes on the server.
     *
     * @param  string|array<string, string>|null  $answer
     */
    public function submit(User $user, Activity $activity, string|array|null $answer, ?UploadedFile $file = null): ActivitySubmission
    {
        $submission = $user->activitySubmissions()->firstOrNew(['activity_id' => $activity->id]);

        if ($file !== null) {
            $submission->file_path = $file->store("activity-submissions/{$user->id}");
        }

        $submission->answer = is_array($answer) ? json_encode($answer, JSON_THROW_ON_ERROR) : $answer;
        $submission->attempts++;
        $submission->submitted_at = now();

        if ($activity->type === ActivityType::Quiz) {
            $submission->score = $this->gradeQuiz($activity, is_array($answer) ? $answer : []);
            $passed = $submission->score >= $activity->passing_score;
        } else {
            $passed = true;
        }

        if ($passed && $submission->passed_at === null) {
            $submission->passed_at = now();
        }

        $submission->save();

        if ($submission->passed_at !== null) {
            $this->achievements->unlock($user, Achievement::FIRST_ACTIVITY);
        }

        $this->evaluateModule($user, $activity->module);

        return $submission;
    }

    /**
     * Mark the module as completed when every requirement is met, then refresh the trail progress.
     */
    public function evaluateModule(User $user, TrailModule $module): bool
    {
        $isComplete = $this->moduleRequirementsMet($user, $module);

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
     * @return array{lessons: list<int>, activity: bool}
     */
    public function missingModuleRequirements(User $user, TrailModule $module): array
    {
        $requiredLessonIds = $module->lessons()->where('is_required', true)->pluck('id');
        $completedLessonIds = $user->lessonProgress()
            ->whereIn('lesson_id', $requiredLessonIds)
            ->whereNotNull('completed_at')
            ->pluck('lesson_id');

        $activity = $module->activity;
        $activityMissing = $activity !== null
            && $activity->is_required
            && ! $user->activitySubmissions()
                ->where('activity_id', $activity->id)
                ->whereNotNull('passed_at')
                ->exists();

        return [
            'lessons' => $requiredLessonIds->diff($completedLessonIds)->values()->all(),
            'activity' => $activityMissing,
        ];
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
     * Recalculate percentage, current module and completion of the user's enrollment.
     */
    private function refreshEnrollment(User $user, Trail $trail): void
    {
        $enrollment = $this->enrollment($user, $trail);

        if ($enrollment === null) {
            return;
        }

        $modules = $trail->modules()->with(['lessons', 'activity'])->get();
        $moduleIds = $modules->pluck('id')->map(fn (mixed $id): int => (int) $id);
        $completedModules = $this->completedModuleIds($user, $moduleIds);

        $requiredLessonIds = $modules->flatMap->lessons->where('is_required', true)->pluck('id');
        $requiredActivityIds = $modules->pluck('activity')->filter(fn (?Activity $activity): bool => $activity?->is_required ?? false)->pluck('id');

        $completedLessons = $user->lessonProgress()->whereIn('lesson_id', $requiredLessonIds)->whereNotNull('completed_at')->count();
        $passedActivities = $user->activitySubmissions()->whereIn('activity_id', $requiredActivityIds)->whereNotNull('passed_at')->count();
        $totalItems = $requiredLessonIds->count() + $requiredActivityIds->count();

        $isTrailComplete = $modules->isNotEmpty() && count($completedModules) === $modules->count();
        $nextModuleId = $moduleIds->first(fn (int $id): bool => ! in_array($id, $completedModules, true));

        $enrollment->fill([
            'percent' => $isTrailComplete ? 100 : ($totalItems === 0 ? 0 : (int) min(99, floor(($completedLessons + $passedActivities) / $totalItems * 100))),
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

    private function touchEnrollment(User $user, TrailModule $module): void
    {
        $user->enrollments()
            ->where('trail_id', $module->trail_id)
            ->update(['last_activity_at' => now(), 'current_module_id' => $module->id]);
    }

    private function moduleRequirementsMet(User $user, TrailModule $module): bool
    {
        $missing = $this->missingModuleRequirements($user, $module);

        return $missing['lessons'] === [] && ! $missing['activity'];
    }

    private function lessonRequirementsMet(Lesson $lesson, LessonProgress $progress): bool
    {
        return match ($lesson->type) {
            LessonType::Text => $progress->reached_end && $progress->engaged_seconds >= $lesson->requiredEngagedSeconds(),
            LessonType::Image => $progress->engaged_seconds >= $lesson->requiredEngagedSeconds(),
            LessonType::Link => $progress->reached_end,
            LessonType::Video => $this->watchedRatio($lesson, $progress) * 100 >= $lesson->completion_threshold,
        };
    }

    /**
     * Credit the video segments played since the last heartbeat.
     *
     * Jumps forward faster than the maximum playback rate are treated as seeks and credit nothing.
     */
    private function creditWatchedVideo(Lesson $lesson, LessonProgress $progress, ?int $position, ?float $elapsed): void
    {
        $segments = str_pad((string) $progress->watched_segments, $lesson->segmentCount(), '0');
        $previous = $progress->last_position_seconds;

        if ($position !== null && $previous !== null && $elapsed !== null) {
            $advanced = $position - $previous;

            if ($advanced > 0 && $advanced <= $elapsed * self::MAX_PLAYBACK_RATE + 2) {
                $first = intdiv($previous, Lesson::SEGMENT_SECONDS);
                $last = min($lesson->segmentCount() - 1, max($first, (int) ceil($position / Lesson::SEGMENT_SECONDS) - 1));

                for ($index = $first; $index <= $last; $index++) {
                    $segments[$index] = '1';
                }
            }
        }

        $progress->watched_segments = $segments;

        if ($position !== null) {
            $progress->last_position_seconds = $position;
        }
    }

    private function watchedRatio(Lesson $lesson, LessonProgress $progress): float
    {
        $watched = substr_count((string) $progress->watched_segments, '1');

        return $watched / $lesson->segmentCount();
    }

    /**
     * Score a quiz from 0 to 100.
     *
     * @param  array<string, string>  $answers
     */
    private function gradeQuiz(Activity $activity, array $answers): int
    {
        $questions = collect($activity->questions ?? []);

        if ($questions->isEmpty()) {
            return 100;
        }

        $correct = $questions->filter(
            fn (array $question): bool => ($answers[$question['id']] ?? null) === $question['respostaCorretaId'],
        )->count();

        return (int) round($correct / $questions->count() * 100);
    }
}
