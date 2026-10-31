<?php

namespace App\Filament\Resources\Trails\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

/**
 * Optional phases group modules into stages (e.g. Fundamentos, Prática, Projecto final).
 */
class PhasesRelationManager extends RelationManager
{
    protected static string $relationship = 'phases';

    protected static ?string $title = 'Fases';

    protected static ?string $modelLabel = 'fase';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')->label('Título')->required()->maxLength(255),
                Textarea::make('description')->label('Descrição')->rows(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->description('Opcional. Sem fases, os módulos aparecem numa só lista.')
            ->recordTitleAttribute('title')
            ->reorderable('position')
            ->defaultSort('position')
            ->columns([
                TextColumn::make('position')->label('#'),
                TextColumn::make('title')->label('Fase'),
                TextColumn::make('modules_count')->label('Módulos')->counts('modules'),
            ])
            ->headerActions([
                CreateAction::make()->mutateDataUsing(fn (array $data): array => [
                    ...$data,
                    'position' => $this->getOwnerRecord()->phases()->max('position') + 1,
                ]),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
