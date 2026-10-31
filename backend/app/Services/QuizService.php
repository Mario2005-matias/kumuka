<?php

namespace App\Services;

use App\Models\Lesson;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\TrailModule;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

/**
 * Runs lesson checkpoints and module quizzes.
 *
 * Module quizzes draw a random set of questions from the bank, favouring questions the student
 * did not see in the previous attempt, so retrying means answering new questions rather than
 * memorising the last ones. A failed attempt starts a short cooldown.
 */
class QuizService
{
    public function __construct(
        private QuizGrader $grader,
        private TrailProgressService $progress,
    ) {}

    /**
     * When the student may start the next module quiz attempt, or null if they can start now.
     */
    public function availableAt(User $user, TrailModule $module): ?Carbon
    {
        $lastFailed = $user->quizAttempts()
            ->where('trail_module_id', $module->id)
            ->whereNull('lesson_id')
            ->whereNotNull('submitted_at')
            ->latest('submitted_at')
            ->first();

        if ($lastFailed === null || $lastFailed->passed) {
            return null;
        }

        $availableAt = $lastFailed->submitted_at->copy()->addMinutes($module->quiz_cooldown_minutes);

        return $availableAt->isFuture() ? $availableAt : null;
    }

    /**
     * Start (or resume) a module quiz attempt.
     */
    public function startModuleQuiz(User $user, TrailModule $module): QuizAttempt
    {
        $open = $user->quizAttempts()
            ->where('trail_module_id', $module->id)
            ->whereNull('lesson_id')
            ->whereNull('submitted_at')
            ->latest()
            ->first();

        if ($open !== null) {
            return $open;
        }

        if (! $this->progress->lessonsCompleted($user, $module)) {
            throw ValidationException::withMessages(['quiz' => __('Conclui todas as lições do módulo antes do quiz.')]);
        }

        if (($availableAt = $this->availableAt($user, $module)) !== null) {
            throw ValidationException::withMessages([
                'quiz' => __('Podes tentar de novo a partir das :time.', ['time' => $availableAt->format('H:i')]),
            ]);
        }

        $previousIds = collect($user->quizAttempts()
            ->where('trail_module_id', $module->id)
            ->whereNull('lesson_id')
            ->latest()
            ->value('question_ids') ?? []);

        $bank = $module->quizQuestions()->pluck('id');
        $fresh = $bank->diff($previousIds)->shuffle();
        $repeated = $bank->intersect($previousIds)->shuffle();
        $selected = $fresh->concat($repeated)->take(max(1, $module->quiz_question_count))->values();

        return $user->quizAttempts()->create([
            'trail_module_id' => $module->id,
            'question_ids' => $selected->all(),
        ]);
    }

    /**
     * Grade a module quiz attempt.
     *
     * @param  array<string, mixed>  $answers
     */
    public function submitModuleQuiz(User $user, QuizAttempt $attempt, array $answers): QuizAttempt
    {
        if ($attempt->submitted_at !== null) {
            throw ValidationException::withMessages(['quiz' => __('Esta tentativa já foi submetida.')]);
        }

        $module = $attempt->module;
        $this->grade($attempt, $this->questions($attempt->question_ids), $answers, $module->quiz_passing_score);
        $this->progress->evaluateModule($user, $module);

        return $attempt;
    }

    /**
     * Grade the checkpoint of a lesson. All answers must be correct; retries are unlimited.
     *
     * @param  array<string, mixed>  $answers
     */
    public function submitCheckpoint(User $user, Lesson $lesson, array $answers): QuizAttempt
    {
        $questions = $lesson->checkpointQuestions()->get();

        $attempt = $user->quizAttempts()->create([
            'trail_module_id' => $lesson->trail_module_id,
            'lesson_id' => $lesson->id,
            'question_ids' => $questions->pluck('id')->all(),
        ]);

        $this->grade($attempt, $questions, $answers, 100);

        if ($attempt->passed) {
            $this->progress->evaluateLesson($user, $lesson);
        }

        return $attempt;
    }

    /**
     * Questions of an attempt in the order they were drawn.
     *
     * @param  list<int>  $ids
     * @return Collection<int, Question>
     */
    public function questions(array $ids): Collection
    {
        $questions = Question::query()->whereIn('id', $ids)->get()->keyBy('id');

        return collect($ids)->map(fn (int $id): ?Question => $questions->get($id))->filter()->values();
    }

    /**
     * @param  Collection<int, Question>  $questions
     * @param  array<string, mixed>  $answers
     */
    private function grade(QuizAttempt $attempt, Collection $questions, array $answers, int $passingScore): void
    {
        $results = $questions->map(fn (Question $question): array => $this->grader->feedback($question, $answers[(string) $question->id] ?? null));
        $correct = $results->where('correta', true)->count();
        $score = $questions->isEmpty() ? 100 : (int) round($correct / $questions->count() * 100);

        $attempt->fill([
            'answers' => $answers,
            'results' => $results->all(),
            'score' => $score,
            'passed' => $score >= $passingScore,
            'submitted_at' => now(),
        ])->save();
    }
}
