<?php

namespace App\Filament\Resources\Users\RelationManagers;

use App\Models\TrailEnrollment;
use Filament\Actions\Action;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

/**
 * The student's trails. Progress comes from what they actually did, so it is not edited
 * here; it can only be reset (for example, when a student wants to start again).
 */
class EnrollmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'enrollments';

    protected static ?string $title = 'Progresso nas trilhas';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('trail.title')->label('Trilha')->wrap(),
                TextColumn::make('percent')->label('Progresso')->suffix('%'),
                TextColumn::make('mastery')->label('Domínio')->suffix('%'),
                TextColumn::make('started_at')->label('Início')->date('d/m/Y'),
                TextColumn::make('last_activity_at')->label('Última actividade')->since(),
                TextColumn::make('completed_at')->label('Concluída')->date('d/m/Y')->placeholder('—'),
            ])
            ->recordActions([
                Action::make('reset')
                    ->label('Repor progresso')
                    ->icon(Heroicon::OutlinedArrowPath)
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalDescription('Apaga as lições, quizzes e tarefas deste estudante nesta trilha. Esta acção não pode ser desfeita.')
                    ->action(fn (TrailEnrollment $record) => $this->resetProgress($record)),
            ]);
    }

    private function resetProgress(TrailEnrollment $enrollment): void
    {
        $user = $enrollment->user;
        $modules = $enrollment->trail->modules()->with(['lessons.blocks', 'activity'])->get();

        DB::transaction(function () use ($user, $modules, $enrollment): void {
            $user->moduleCompletions()->whereIn('trail_module_id', $modules->pluck('id'))->delete();
            $user->lessonProgress()->whereIn('lesson_id', $modules->flatMap->lessons->pluck('id'))->delete();
            $user->blockProgress()->whereIn('lesson_block_id', $modules->flatMap->lessons->flatMap->blocks->pluck('id'))->delete();
            $user->quizAttempts()->whereIn('trail_module_id', $modules->pluck('id'))->delete();
            $user->activitySubmissions()->whereIn('activity_id', $modules->pluck('activity')->filter()->pluck('id'))->delete();
            $enrollment->delete();
        });
    }
}
