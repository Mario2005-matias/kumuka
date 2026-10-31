<?php

use App\Models\Achievement;
use App\Models\Activity;
use App\Models\Lesson;
use App\Models\Trail;
use App\Models\TrailModule;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(AchievementSeeder::class);
    $this->user = User::factory()->create();
    $this->trail = Trail::factory()->create(['has_certificate' => true]);
    $this->firstModule = TrailModule::factory()->for($this->trail)->create(['position' => 1]);
    $this->secondModule = TrailModule::factory()->for($this->trail)->create(['position' => 2]);
    $this->actingAs($this->user);
});

/**
 * Send heartbeats every ten seconds for the given duration.
 */
function engage(Lesson $lesson, int $seconds, array $payload = ['event' => 'progress']): void
{
    test()->postJson("/api/me/lessons/{$lesson->id}/heartbeats", $payload)->assertSuccessful();

    for ($elapsed = 10; $elapsed <= $seconds; $elapsed += 10) {
        test()->travel(10)->seconds();
        test()->postJson("/api/me/lessons/{$lesson->id}/heartbeats", $payload)->assertSuccessful();
    }
}

function enroll(Trail $trail): void
{
    test()->postJson("/api/me/trails/{$trail->slug}/enrollment")->assertCreated();
}

it('hides module content until the student enrolls', function () {
    $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->firstModule->id}")->assertForbidden();

    enroll($this->trail);

    $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->firstModule->id}")->assertSuccessful();
});

it('keeps later modules locked in sequential trails', function () {
    enroll($this->trail);

    $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->secondModule->id}")->assertForbidden();
    $this->getJson("/api/me/trails/{$this->trail->slug}/progress")
        ->assertJsonPath('data.modulosAcessiveis', [(string) $this->firstModule->id]);
});

it('does not complete a text lesson just by opening it', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create(['min_engaged_seconds' => 30]);
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress', 'reachedEnd' => true])
        ->assertSuccessful()
        ->assertJsonPath('data.concluida', false);
});

it('completes a text lesson after enough active reading and reaching the end', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create(['min_engaged_seconds' => 30]);
    enroll($this->trail);

    engage($lesson, 30);
    expect($this->user->lessonProgress()->sole()->completed_at)->toBeNull();

    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress', 'reachedEnd' => true])
        ->assertJsonPath('data.concluida', true);
});

it('does not credit time while the student is away', function () {
    $lesson = Lesson::factory()->for($this->firstModule, 'module')->create(['min_engaged_seconds' => 30]);
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress']);
    $this->travel(10)->minutes();
    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress', 'reachedEnd' => true])
        ->assertJsonPath('data.segundosEnvolvidos', 0)
        ->assertJsonPath('data.concluida', false);
});

it('does not count video segments skipped by seeking', function () {
    $lesson = Lesson::factory()->video(100)->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress', 'position' => 0]);
    $this->travel(10)->seconds();
    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'ended', 'position' => 100])
        ->assertJsonPath('data.concluida', false)
        ->assertJsonPath('data.percentual', 0);
});

it('completes a video once most of it has been watched', function () {
    $lesson = Lesson::factory()->video(100)->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress', 'position' => 0]);

    foreach (range(10, 80, 10) as $position) {
        $this->travel(10)->seconds();
        $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress', 'position' => $position])
            ->assertJsonPath('data.concluida', false);
    }

    $this->travel(10)->seconds();
    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'progress', 'position' => 90])
        ->assertJsonPath('data.concluida', true);
});

it('completes a link lesson when the link is opened', function () {
    $lesson = Lesson::factory()->link()->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'opened'])->assertJsonPath('data.concluida', true);
});

it('never sends quiz answers to the client', function () {
    Activity::factory()->quiz()->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $response = $this->getJson("/api/trails/{$this->trail->slug}/modules/{$this->firstModule->id}")->assertSuccessful();

    expect($response->json('data.atividade.perguntas.0'))->not->toHaveKey('respostaCorretaId');
});

it('requires a passing quiz score before the module is completed', function () {
    $activity = Activity::factory()->quiz()->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/activities/{$activity->id}/submission", ['answers' => ['q1' => 'a', 'q2' => 'b']])
        ->assertSuccessful()
        ->assertJsonPath('data.nota', 50)
        ->assertJsonPath('data.aprovada', false);

    $this->getJson("/api/me/trails/{$this->trail->slug}/progress")->assertJsonPath('data.modulosConcluidos', []);

    $this->postJson("/api/me/activities/{$activity->id}/submission", ['answers' => ['q1' => 'a', 'q2' => 'a']])
        ->assertJsonPath('data.aprovada', true)
        ->assertJsonPath('data.tentativas', 2);

    $this->getJson("/api/me/trails/{$this->trail->slug}/progress")
        ->assertJsonPath('data.modulosConcluidos', [(string) $this->firstModule->id])
        ->assertJsonPath('data.modulosAcessiveis', [(string) $this->firstModule->id, (string) $this->secondModule->id]);
});

it('rejects writing answers that are too short', function () {
    $activity = Activity::factory()->for($this->firstModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/activities/{$activity->id}/submission", ['answer' => 'ok'])->assertUnprocessable();
});

it('blocks work on locked modules', function () {
    $lesson = Lesson::factory()->link()->for($this->secondModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$lesson->id}/heartbeats", ['event' => 'opened'])->assertForbidden();
});

it('completes the trail and unlocks achievements when every module is done', function () {
    $firstLesson = Lesson::factory()->link()->for($this->firstModule, 'module')->create();
    $activity = Activity::factory()->for($this->secondModule, 'module')->create();
    enroll($this->trail);

    $this->postJson("/api/me/lessons/{$firstLesson->id}/heartbeats", ['event' => 'opened']);
    $this->getJson("/api/me/trails/{$this->trail->slug}/progress")->assertJsonPath('data.percentual', 50);

    $this->putJson("/api/me/activities/{$activity->id}/draft", ['answer' => 'rascunho'])->assertJsonPath('data.submetida', false);
    $this->postJson("/api/me/activities/{$activity->id}/submission", ['answer' => 'Uma resposta suficientemente longa para contar.']);

    $this->getJson("/api/me/trails/{$this->trail->slug}/progress")
        ->assertJsonPath('data.estado', 'concluido')
        ->assertJsonPath('data.percentual', 100);

    expect($this->user->achievements()->pluck('code')->all())->toContain(
        Achievement::FIRST_TRAIL,
        Achievement::FIRST_CERTIFICATE,
        Achievement::FIRST_ACTIVITY,
    );
});
