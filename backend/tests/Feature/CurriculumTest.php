<?php

use App\Enums\QuestionType;
use App\Models\Question;
use App\Models\Trail;
use App\Services\QuizGrader;
use Database\Seeders\CurriculumSeeder;
use Database\Seeders\LearningContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([LearningContentSeeder::class, CurriculumSeeder::class]);
});

it('applies every curriculum file to its trail', function () {
    $files = glob(database_path('seeders/curriculum/*.php'));

    expect(Trail::query()->where('content_version', '>', 0)->count())->toBe(count($files));
});

it('gives every lesson a checkpoint and every module a quiz and a task', function () {
    Trail::query()->where('content_version', '>', 0)->with('modules.lessons.checkpointQuestions', 'modules.activity')->get()
        ->flatMap->modules
        ->each(function ($module): void {
            expect($module->quizQuestions()->count())->toBeGreaterThan(0, "Módulo sem quiz: {$module->title}")
                ->and($module->activity)->not->toBeNull("Módulo sem tarefa: {$module->title}");

            $module->lessons->each(fn ($lesson) => expect($lesson->checkpointQuestions)->not->toBeEmpty("Lição sem verificação: {$lesson->title}"));
        });
});

it('defines a correct answer and an explanation for every question', function () {
    $grader = app(QuizGrader::class);

    Question::query()->get()->each(function (Question $question) use ($grader): void {
        expect($question->explanation)->not->toBeEmpty("Pergunta sem explicação: {$question->prompt}");

        $answer = $grader->correctAnswer($question);
        expect($grader->isCorrect($question, $answer))->toBeTrue("Resposta certa inválida: {$question->prompt}");

        if (in_array($question->type, [QuestionType::Single, QuestionType::Multiple], true)) {
            expect(collect($question->options)->where('correct', true))->not->toBeEmpty("Sem opção certa: {$question->prompt}");
        }
    });
});

it('does not re-apply a curriculum that is already current', function () {
    $questions = Question::query()->count();

    $this->seed(CurriculumSeeder::class);

    expect(Question::query()->count())->toBe($questions);
});
