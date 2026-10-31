<?php

namespace App\Filament\Resources\Trails\RelationManagers;

use App\Filament\Resources\TrailModules\TrailModuleResource;
use App\Models\TrailModule;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ModulesRelationManager extends RelationManager
{
    protected static string $relationship = 'modules';

    protected static ?string $title = 'Módulos';

    protected static ?string $modelLabel = 'módulo';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')->label('Título')->required()->maxLength(255),
                Select::make('trail_phase_id')
                    ->label('Fase')
                    ->relationship('phase', 'title', fn ($query) => $query->where('trail_id', $this->getOwnerRecord()->getKey()))
                    ->placeholder('Sem fase'),
                Textarea::make('description')->label('Objectivo do módulo')->helperText('O que o estudante consegue fazer depois deste módulo.')->rows(2)->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->reorderable('position')
            ->defaultSort('position')
            ->columns([
                TextColumn::make('position')->label('#'),
                TextColumn::make('title')->label('Módulo')->wrap(),
                TextColumn::make('phase.title')->label('Fase')->placeholder('—'),
                TextColumn::make('lessons_count')->label('Lições')->counts('lessons'),
                TextColumn::make('quiz_questions_count')->label('Perguntas do quiz')->counts('quizQuestions')
                    ->color(fn (int $state): string => $state < 8 ? 'warning' : 'success'),
            ])
            ->headerActions([
                CreateAction::make()
                    ->mutateDataUsing(fn (array $data): array => [
                        ...$data,
                        'position' => $this->getOwnerRecord()->modules()->max('position') + 1,
                    ])
                    ->successRedirectUrl(fn (TrailModule $record): string => TrailModuleResource::getUrl('edit', ['record' => $record])),
            ])
            ->recordUrl(fn (TrailModule $record): string => TrailModuleResource::getUrl('edit', ['record' => $record]))
            ->recordActions([
                Action::make('open')
                    ->label('Editar conteúdo')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->url(fn (TrailModule $record): string => TrailModuleResource::getUrl('edit', ['record' => $record])),
                DeleteAction::make(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
