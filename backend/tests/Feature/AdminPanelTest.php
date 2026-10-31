<?php

use App\Enums\QuestionType;
use App\Filament\Resources\Achievements\Pages\ListAchievements;
use App\Filament\Resources\Lessons\LessonResource;
use App\Filament\Resources\Lessons\Pages\EditLesson;
use App\Filament\Resources\TrailModules\Pages\EditTrailModule;
use App\Filament\Resources\TrailModules\RelationManagers\QuestionsRelationManager;
use App\Filament\Resources\Trails\Pages\CreateTrail;
use App\Filament\Resources\Trails\Pages\ListTrails;
use App\Filament\Resources\Trails\TrailResource;
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\RelationManagers\EnrollmentsRelationManager;
use App\Filament\Resources\Users\UserResource;
use App\Models\Achievement;
use App\Models\Experience;
use App\Models\Lesson;
use App\Models\Opportunity;
use App\Models\Question;
use App\Models\Trail;
use App\Models\TrailModule;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\PilotTrailSeeder;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\RestoreAction;
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
        '/admin/users/create', UserResource::getUrl('edit', ['record' => User::factory()->create()]),
        '/admin/achievements', '/admin/activity-submissions',
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

it('archives a trail so students no longer see it, and restores it', function () {
    $trail = Trail::factory()->create();
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    Livewire::test(ListTrails::class)->callAction(TestAction::make(DeleteAction::class)->table($trail));

    expect($trail->fresh()->trashed())->toBeTrue();
    $student = User::factory()->create();
    $student->enrollments()->create(['trail_id' => $trail->id, 'started_at' => now()]);
    $this->actingAs($student, 'sanctum')->getJson("/api/trails/{$trail->slug}")->assertNotFound();
    $this->getJson('/api/me/trails')->assertJsonCount(0, 'data');

    $this->actingAs($admin);
    Livewire::test(ListTrails::class)
        ->filterTable('trashed', false)
        ->callAction(TestAction::make(RestoreAction::class)->table($trail));

    expect($trail->fresh()->trashed())->toBeFalse();
});

it('creates an account that can sign in to the app', function () {
    $this->actingAs(User::factory()->admin()->create());

    Livewire::test(CreateUser::class)
        ->fillForm([
            'email' => 'nova@kumuka.ao',
            'role' => 'student',
            'password' => 'segredo-forte',
            'profile' => ['name' => 'Nova Estudante'],
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    expect(User::query()->where('email', 'nova@kumuka.ao')->sole()->profile->name)->toBe('Nova Estudante');
    $this->postJson('/api/auth/login', ['email' => 'nova@kumuka.ao', 'password' => 'segredo-forte'])->assertOk();
});

it('suspends an account so it can no longer use the app', function () {
    $student = User::factory()->create(['email' => 'aluno@kumuka.ao']);
    $token = $student->createToken('spa')->plainTextToken;
    $this->actingAs(User::factory()->admin()->create());

    Livewire::test(ListUsers::class)->callAction(TestAction::make(DeleteAction::class)->table($student));

    auth()->forgetGuards();
    $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
    $this->postJson('/api/auth/login', ['email' => 'aluno@kumuka.ao', 'password' => 'password'])->assertUnprocessable();
});

it('does not let administrators suspend themselves', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    Livewire::test(ListUsers::class)->assertActionHidden(TestAction::make(DeleteAction::class)->table($admin));
});

it('revokes app sessions when an administrator changes a password', function () {
    $student = User::factory()->create();
    $student->createToken('spa');
    $this->actingAs(User::factory()->admin()->create());

    Livewire::test(EditUser::class, ['record' => $student->getRouteKey()])
        ->fillForm(['password' => 'outra-password'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($student->tokens()->count())->toBe(0);
});

it('protects achievements the platform unlocks automatically', function () {
    $this->seed(AchievementSeeder::class);
    $this->actingAs(User::factory()->admin()->create());
    $custom = Achievement::create(['code' => 'mentor-do-mes', 'title' => 'Mentor do mês', 'description' => 'Atribuída pela equipa.']);

    Livewire::test(ListAchievements::class)
        ->assertActionHidden(TestAction::make(DeleteAction::class)->table(Achievement::query()->where('code', Achievement::FIRST_TRAIL)->sole()))
        ->callAction(TestAction::make(DeleteAction::class)->table($custom));

    expect(Achievement::query()->whereKey($custom->id)->exists())->toBeFalse();
});

it('resets a student\'s progress in a trail', function () {
    $this->seed(PilotTrailSeeder::class);
    $student = User::factory()->create();
    $trail = Trail::sole();
    $lesson = $trail->modules()->first()->lessons()->first();
    $enrollment = $student->enrollments()->create(['trail_id' => $trail->id, 'started_at' => now()]);
    $student->lessonProgress()->create(['lesson_id' => $lesson->id, 'completed_at' => now()]);
    $this->actingAs(User::factory()->admin()->create());

    Livewire::test(EnrollmentsRelationManager::class, ['ownerRecord' => $student, 'pageClass' => EditUser::class])
        ->callAction(TestAction::make('reset')->table($enrollment));

    expect($student->enrollments()->exists())->toBeFalse()
        ->and($student->lessonProgress()->exists())->toBeFalse();
});
