<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Actions\AttachAction;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

/**
 * Achievements are unlocked automatically; staff can grant or remove them by hand.
 */
class AchievementsRelationManager extends RelationManager
{
    protected static string $relationship = 'achievements';

    protected static ?string $title = 'Conquistas';

    protected static ?string $modelLabel = 'conquista';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Conquista'),
                TextColumn::make('pivot.unlocked_at')->label('Desbloqueada em')->dateTime('d/m/Y H:i'),
            ])
            ->headerActions([
                AttachAction::make()->label('Atribuir conquista')->preloadRecordSelect()
                    ->mutateDataUsing(fn (array $data): array => [...$data, 'unlocked_at' => now()]),
            ])
            ->recordActions([DetachAction::make()->label('Retirar')])
            ->toolbarActions([DetachBulkAction::make()]);
    }
}
