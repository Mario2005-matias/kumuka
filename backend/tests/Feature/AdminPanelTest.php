<?php

use App\Enums\QuestionType;
use App\Filament\Resources\Lessons\LessonResource;
use App\Filament\Resources\Lessons\Pages\EditLesson;
use App\Filament\Resources\TrailModules\Pages\EditTrailModule;
use App\Filament\Resources\TrailModules\RelationManagers\QuestionsRelationManager;
use App\Filament\Resources\Trails\Pages\CreateTrail;
use App\Filament\Resources\Trails\TrailResource;
use App\Filament\Resources\Users\UserResource;
use App\Models\Experience;
use App\Models\Lesson;
use App\Models\Opportunity;
use App\Models\Question;
use App\Models\Trail;
use App\Models\TrailModule;
use App\Models\User;
use Database\Seeders\PilotTrailSeeder;
use Filament\Actions\CreateAction;
use Filament\Actions\Testing\TestAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

it('keeps students out of the admin panel', function () {
    $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
});

it('lets content authors manage trails but not users', function () {
    $this->actingAs(User::factory()->author()->create());

    $this->get('/admin/trails')->assertOk();
    $this->get(UserResource::getUrl())->assertForbidden();
});

it('opens every admin page for administrators', function () {
    $this->seed(PilotTrailSeeder::class);
    Opportunity::factory()->create();
    Experience::factory()->create();
    $this->actingAs(User::factory()->admin()->create());

    $trail = Trail::sole();
    $module = $trail->modules()->first();
    $lesson = $module->lessons()->first();

    foreach ([
        '/admin', '/admin/trails', TrailResource::getUrl('edit', ['record' => $trail]), "/admin/trail-modules/{$module->id}/edit",
        "/admin/lessons/{$lesson->id}/edit", '/admin/opportunities', '/admin/opportunities/create', '/admin/companies',
        '/admin/experiences', '/admin/opportunity-applications', '/admin/quick-learnings', '/admin/guides', '/admin/users',
    ] as $url) {
        $this->get($url)->assertOk();
    }
});

it('creates a trail from the admin panel', function () {
    $this->actingAs(User::factory()->admin()->create());

    Livewire::test(CreateTrail::class)
        ->fillForm([
            'title' => 'Excel do zero',
            'slug' => 'excel-do-zero',
            'summary' => 'Resumo',
            'description' => 'Descrição',
            'category' => 'Dados',
            'core_competence' => 'Excel',
            'expected_outcome' => 'Montar um dashboard',
            'level' => 'iniciante',
            'duration_minutes' => 120,
            'status' => 'draft',
            'access' => 'free',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    expect(Trail::query()->where('slug', 'excel-do-zero')->exists())->toBeTrue();
});

it('adds questions of each answer shape to a module bank', function () {
    $this->actingAs(User::factory()->admin()->create());
    $module = TrailModule::factory()->create();

    Livewire::test(QuestionsRelationManager::class, ['ownerRecord' => $module, 'pageClass' => EditTrailModule::class])
        ->callAction(TestAction::make(CreateAction::class)->table(), [
            'type' => QuestionType::TrueFalse->value,
            'prompt' => 'O CV deve ter uma página?',
            'correct_boolean' => true,
            'explanation' => 'Com pouca experiência, uma página chega.',
            'is_active' => true,
        ])
        ->assertHasNoFormErrors();

    $question = Question::sole();
    expect($question->type)->toBe(QuestionType::TrueFalse)
        ->and($question->correct_boolean)->toBeTrue()
        ->and($question->options)->toBeNull();
});

it('saves the content blocks of a lesson', function () {
    $this->actingAs(User::factory()->admin()->create());
    $lesson = Lesson::factory()->create();

    Livewire::test(EditLesson::class, ['record' => $lesson->getRouteKey()])
        ->fillForm([
            'blocks' => [
                ['type' => 'texto', 'title' => 'Explicação', 'body' => 'Texto da lição'],
                ['type' => 'video', 'media_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'duration_seconds' => 120],
            ],
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($lesson->blocks()->pluck('type')->map->value->all())->toBe(['texto', 'video'])
        ->and(LessonResource::getUrl('edit', ['record' => $lesson]))->toContain((string) $lesson->id);
});
