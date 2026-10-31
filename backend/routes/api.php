<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\Me;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\QuickLearningController;
use App\Http\Controllers\TrailController;
use App\Http\Controllers\TrailModuleController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function () {
    Route::middleware('throttle:auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login', [AuthController::class, 'login'])->name('login');
        Route::post('forgot-password', [PasswordResetController::class, 'sendLink'])->name('password.email');
        Route::post('reset-password', [PasswordResetController::class, 'reset'])->name('password.update');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
    });
});

Route::get('faqs', [FaqController::class, 'index'])->name('faqs.index');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('trails', TrailController::class)->only(['index', 'show']);
    Route::get('trails/{trail}/modules/{module}', [TrailModuleController::class, 'show'])
        ->scopeBindings()
        ->name('trails.modules.show');
    Route::apiResource('quick-learnings', QuickLearningController::class)->only(['index', 'show']);
    Route::apiResource('guides', GuideController::class)->only(['index', 'show']);
    Route::apiResource('opportunities', OpportunityController::class)->only(['index', 'show']);
    Route::apiResource('experiences', ExperienceController::class)->only(['index', 'show']);
    Route::get('companies/{company}', [CompanyController::class, 'show'])->name('companies.show');

    Route::prefix('me')->name('me.')->group(function () {
        Route::get('profile', [Me\ProfileController::class, 'show'])->name('profile.show');
        Route::patch('profile', [Me\ProfileController::class, 'update'])->name('profile.update');
        Route::get('competences', [Me\CompetenceController::class, 'index'])->name('competences.index');
        Route::get('achievements', [Me\AchievementController::class, 'index'])->name('achievements.index');
        Route::get('recommendations', [Me\RecommendationController::class, 'index'])->name('recommendations.index');
        Route::apiResource('projects', Me\ProjectController::class)->only(['index', 'store']);

        Route::get('trails', [Me\TrailProgressController::class, 'index'])->name('trails.index');
        Route::get('trails/{trail}/progress', [Me\TrailProgressController::class, 'show'])->name('trails.progress.show');
        Route::post('trails/{trail}/enrollment', [Me\TrailProgressController::class, 'store'])->name('trails.enrollment.store');
        Route::post('lessons/{lesson}/read', [Me\LessonController::class, 'markRead'])->name('lessons.read');
        Route::post('lessons/{lesson}/checkpoint', [Me\LessonController::class, 'checkpoint'])->name('lessons.checkpoint');
        Route::post('blocks/{block}/heartbeats', [Me\BlockHeartbeatController::class, 'store'])
            ->middleware('throttle:heartbeats')
            ->name('blocks.heartbeats.store');
        Route::get('modules/{module}/quiz', [Me\ModuleQuizController::class, 'show'])->name('modules.quiz.show');
        Route::post('modules/{module}/quiz-attempts', [Me\ModuleQuizController::class, 'store'])->name('modules.quiz-attempts.store');
        Route::post('quiz-attempts/{attempt}/submission', [Me\ModuleQuizController::class, 'submit'])->name('quiz-attempts.submit');
        Route::put('activities/{activity}/draft', [Me\ActivityDraftController::class, 'update'])->name('activities.draft.update');
        Route::post('activities/{activity}/submission', [Me\ActivitySubmissionController::class, 'store'])->name('activities.submission.store');

        Route::apiResource('opportunity-applications', Me\OpportunityApplicationController::class)->only(['index', 'store']);
        Route::apiResource('experience-registrations', Me\ExperienceRegistrationController::class)->only(['index', 'store']);
    });
});
