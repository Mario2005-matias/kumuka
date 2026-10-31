<?php

namespace App\Filament\Widgets;

use App\Enums\UserRole;
use App\Models\QuizAttempt;
use App\Models\TrailEnrollment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LearningStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    /**
     * @return array<int, Stat>
     */
    protected function getStats(): array
    {
        $quizAttempts = QuizAttempt::query()->whereNull('lesson_id')->whereNotNull('submitted_at')->where('submitted_at', '>=', now()->subDays(30));
        $totalAttempts = (clone $quizAttempts)->count();
        $passRate = $totalAttempts === 0 ? 0 : round((clone $quizAttempts)->where('passed', true)->count() / $totalAttempts * 100);

        return [
            Stat::make('Estudantes', User::query()->where('role', UserRole::Student)->count())
                ->description(User::query()->where('role', UserRole::Student)->where('created_at', '>=', now()->subDays(7))->count().' novos esta semana'),
            Stat::make('Activos (7 dias)', TrailEnrollment::query()->where('last_activity_at', '>=', now()->subDays(7))->distinct('user_id')->count('user_id'))
                ->description('Estudantes que estudaram numa trilha'),
            Stat::make('Trilhas concluídas', TrailEnrollment::query()->whereNotNull('completed_at')->count())
                ->description(TrailEnrollment::query()->count().' inscrições no total'),
            Stat::make('Aprovação nos quizzes', $passRate.'%')
                ->description($totalAttempts.' tentativas nos últimos 30 dias')
                ->color($passRate >= 60 ? 'success' : 'warning'),
        ];
    }
}
