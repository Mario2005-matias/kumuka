<?php

use App\Enums\QuestionType;
use App\Models\Achievement;
use App\Models\Activity;
use App\Models\Lesson;
use App\Models\LessonBlock;
use App\Models\Question;
use App\Models\Trail;
use App\Models\TrailModule;
use App\Models\User;
use App\Services\QuizGrader;
use Database\Seeders\AchievementSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(AchievementSeeder::class);
    $this->user = User::factory()->create();
    $this->trail = Trail::factory()->create(['has_certificate' => true]);
    $this->firstModule = TrailModule::factory()->for($this->trail)->create(['position' => 1, 'quiz_question_count' => 2]);
    $this->secondModule = TrailModule::factory()->for($this->trail)->create(['position' => 2]);
    $this->actingAs($this->user);
});

function enroll(Trail $trail): void
{
    test()->postJson("/api/me/trails/{$trail->slug}/enrollment")->assertCreated();
}

function progressOf(Trail $trail): array
{
    return test()->getJson("/api/me/trails/{$trail->slug}/progress")->assertOk()->json('data');
}

it('hides module content until the student enrolls', function () {
    $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->firstModule->id}")->assertForbidden();

    enroll($this->trail);

    $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->firstModule->id}")->assertOk();
});

it('keeps later modules locked in sequential trails', function () {
    enroll($this->trail);

    $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->secondModule->id}")->assertForbidden();
    expect(progressOf($this->trail)['modulosAcessiveis'])->toBe([(string) $this->firstModule->id]);
});

it('lets a reading-only lesson be marked as read', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create();
    LessonBlock::factory()->for($lesson)->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/read")->assertOk();

    expect(progressOf($this->trail)['aulas'][(string) $lesson->id]['concluida'])->toBeTrue();
});

it('requires the checkpoint instead of a read button when the lesson has one', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create();
    Question::factory()->checkpoint()->for($this->firstModule, 'module')->for($lesson)->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/read")->assertUnprocessable();
});

it('completes a lesson only when the checkpoint is fully correct, with immediate retries', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create();
    $question = Question::factory()->checkpoint()->for($this->firstModule, 'module')->for($lesson)->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/checkpoint", ['answers' => [(string) $question->id => 'b']])
        ->assertSuccessful()
        ->assertJsonPath('data.aprovada', false)
        ->assertJsonPath('data.resultados.0.explicacao', 'Porque a opção A está certa.');

    $this->postJson("/api/me/lessons/{$lesson->id}/checkpoint", ['answers' => [(string) $question->id => 'a']])
        ->assertJsonPath('data.aprovada', true);

    expect(progressOf($this->trail)['aulas'][(string) $lesson->id]['concluida'])->toBeTrue();
});

it('never sends correct answers with the questions', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create();
    Question::factory()->checkpoint()->for($this->firstModule, 'module')->for($lesson)->create();
    enroll($this->trail);

    $question = $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->firstModule->id}")
        ->json('data.aulas.0.verificacao.0');

    expect($question['opcoes'][0])->toHaveKeys(['id', 'texto'])->not->toHaveKey('correct');
});

it('does not credit video segments skipped by seeking', function () {
    $block = LessonBlock::factory()->video(100)->for(Lesson::factory()->for($this->firstModule, 'module'))->create();
    enroll($this->trail);

    $this->postJson("/api/me/blocks/{$block->id}/heartbeats", ['position' => 0]);
    $this->travel(10)->seconds();
    $this->postJson("/api/me/blocks/{$block->id}/heartbeats", ['position' => 100])
        ->assertJsonPath('data.percentual', 0)
        ->assertJsonPath('data.concluido', false);
});

it('completes a video lesson once most of the video has been watched', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create();
    $block = LessonBlock::factory()->video(100)->for($lesson)->create();
    enroll($this->trail);

    $this->postJson("/api/me/blocks/{$block->id}/heartbeats", ['position' => 0]);

    foreach (range(10, 90, 10) as $position) {
        $this->travel(10)->seconds();
        $this->postJson("/api/me/blocks/{$block->id}/heartbeats", ['position' => $position]);
    }

    expect(progressOf($this->trail)['aulas'][(string) $lesson->id]['concluida'])->toBeTrue();
});

it('keeps the module quiz locked until the lessons are done', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create();
    LessonBlock::factory()->for($lesson)->create();
    Question::factory()->count(3)->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/modules/{$this->firstModule->id}/quiz-attempts")->assertUnprocessable();

    $this->postJson("/api/me/lessons/{$lesson->id}/read");

    $this->postJson("/api/me/modules/{$this->firstModule->id}/quiz-attempts")
        ->assertSuccessful()
        ->assertJsonCount(2, 'data.perguntas');
});

it('requires a passing quiz before completing the module and applies a cooldown after failing', function () {
    Question::factory()->count(2)->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $attempt = $this->postJson("/api/me/modules/{$this->firstModule->id}/quiz-attempts")->json('data');
    $wrong = collect($attempt['perguntas'])->mapWithKeys(fn (array $question) => [$question['id'] => 'b'])->all();

    $this->postJson("/api/me/quiz-attempts/{$attempt['id']}/submission", ['answers' => $wrong])
        ->assertJsonPath('data.nota', 0)
        ->assertJsonPath('data.aprovada', false);

    expect(progressOf($this->trail)['modulosConcluidos'])->toBe([]);
    $this->postJson("/api/me/modules/{$this->firstModule->id}/quiz-attempts")->assertUnprocessable();

    $this->travel(6)->minutes();
    $retry = $this->postJson("/api/me/modules/{$this->firstModule->id}/quiz-attempts")->json('data');
    $right = collect($retry['perguntas'])->mapWithKeys(fn (array $question) => [$question['id'] => 'a'])->all();

    $this->postJson("/api/me/quiz-attempts/{$retry['id']}/submission", ['answers' => $right])
        ->assertJsonPath('data.aprovada', true);

    $progress = progressOf($this->trail);
    expect($progress['modulosConcluidos'])->toBe([(string) $this->firstModule->id])
        ->and($progress['dominio'])->toBe(100);
});

it('does not let a student submit someone else\'s attempt', function () {
    Question::factory()->for($this->firstModule, 'module')->create();
    enroll($this->trail);
    $attempt = $this->postJson("/api/me/modules/{$this->firstModule->id}/quiz-attempts")->json('data');

    $this->actingAs(User::factory()->create());

    $this->postJson("/api/me/quiz-attempts/{$attempt['id']}/submission", ['answers' => []])->assertNotFound();
});

it('grades every question type', function (QuestionType $type, array $attributes, mixed $correct, mixed $wrong) {
    $question = Question::factory()->for($this->firstModule, 'module')->create(['type' => $type, ...$attributes]);
    $grader = app(QuizGrader::class);

    expect($grader->isCorrect($question, $correct))->toBeTrue()
        ->and($grader->isCorrect($question, $wrong))->toBeFalse();
})->with([
    'multiple' => [QuestionType::Multiple, ['options' => [
        ['id' => 'a', 'text' => 'A', 'correct' => true], ['id' => 'b', 'text' => 'B', 'correct' => true], ['id' => 'c', 'text' => 'C', 'correct' => false],
    ]], ['b', 'a'], ['a']],
    'true or false' => [QuestionType::TrueFalse, ['options' => null, 'correct_boolean' => false], false, true],
    'ordering' => [QuestionType::Ordering, ['options' => [['id' => 'x', 'text' => '1º'], ['id' => 'y', 'text' => '2º']]], ['x', 'y'], ['y', 'x']],
    'matching' => [QuestionType::Matching, ['options' => [['id' => 'p', 'left' => 'CV', 'right' => 'Documento'], ['id' => 'q', 'left' => 'NIF', 'right' => 'Número']]], ['p' => 'p', 'q' => 'q'], ['p' => 'q', 'q' => 'p']],
    'fill in the blank' => [QuestionType::FillBlank, ['options' => null, 'accepted_answers' => ['Currículo']], ' curriculo ', 'carta'],
]);

it('completes the trail and unlocks achievements when every module is done', function () {
    $firstLesson = Lesson::factory()->for($this->firstModule, 'module')->create();
    LessonBlock::factory()->for($firstLesson)->create();
    $activity = Activity::factory()->for($this->secondModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$firstLesson->id}/read");
    expect(progressOf($this->trail)['percentual'])->toBe(50);

    $this->putJson("/api/me/activities/{$activity->id}/draft", ['answer' => 'rascunho'])->assertJsonPath('data.submetida', false);
    $this->postJson("/api/me/activities/{$activity->id}/submission", ['answer' => 'Uma resposta suficientemente longa para contar.']);

    $progress = progressOf($this->trail);
    expect($progress['estado'])->toBe('concluido')->and($progress['percentual'])->toBe(100);

    expect($this->user->achievements()->pluck('code')->all())->toContain(
        Achievement::FIRST_TRAIL,
        Achievement::FIRST_CERTIFICATE,
        Achievement::FIRST_ACTIVITY,
    );
});
