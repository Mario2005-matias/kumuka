<?php

use App\Models\Experience;
use App\Models\Opportunity;
use App\Models\Trail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('requires authentication for the catalogue', function () {
    $this->getJson('/api/trails')->assertUnauthorized();
});

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists only published trails with pagination and filters', function () {
    Trail::factory()->count(3)->create(['level' => 'iniciante']);
    Trail::factory()->create(['level' => 'avancado']);
    Trail::factory()->draft()->create();

    $this->actingAs($this->user);

    $this->getJson('/api/trails?pageSize=2')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('meta.total', 4);

    $this->getJson('/api/trails?nivel=avancado')->assertJsonCount(1, 'data');
});

it('hides draft trails', function () {
    $trail = Trail::factory()->draft()->create();
    $this->actingAs($this->user);

    $this->getJson("/api/trails/{$trail->slug}")->assertNotFound();
});

it('applies to an open opportunity once', function () {
    $opportunity = Opportunity::factory()->create();
    $this->actingAs($this->user);

    $this->postJson('/api/me/opportunity-applications', ['opportunityId' => $opportunity->id])->assertCreated();
    $this->postJson('/api/me/opportunity-applications', ['opportunityId' => $opportunity->id])->assertOk();

    expect($this->user->opportunityApplications()->count())->toBe(1);
});

it('rejects applications after the deadline', function () {
    $opportunity = Opportunity::factory()->create(['deadline_at' => now()->subDay()]);
    $this->actingAs($this->user);

    $this->postJson('/api/me/opportunity-applications', ['opportunityId' => $opportunity->id])
        ->assertUnprocessable();
});

it('registers for an experience and reflects the seat count', function () {
    $experience = Experience::factory()->create(['capacity' => 1]);
    $this->actingAs($this->user);

    $this->postJson('/api/me/experience-registrations', ['experienceId' => $experience->id])->assertCreated();

    $this->getJson("/api/experiences/{$experience->slug}")
        ->assertJsonPath('data.estado', 'inscrita')
        ->assertJsonPath('data.vagasOcupadas', 1);

    $this->actingAs(User::factory()->create());
    $this->getJson("/api/experiences/{$experience->slug}")->assertJsonPath('data.estado', 'sem-vagas');
    $this->postJson('/api/me/experience-registrations', ['experienceId' => $experience->id])->assertUnprocessable();
});
