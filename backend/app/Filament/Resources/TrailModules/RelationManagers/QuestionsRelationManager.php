<?php

namespace App\Filament\Resources\TrailModules\RelationManagers;

use App\Filament\Schemas\QuestionForm;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

/**
 * The module's question bank: checkpoint questions (end of a lesson) and quiz questions.
 */
class QuestionsRelationManager extends RelationManager
{
    protected static string $relationship = 'questions';

    protected static ?string $title = 'Banco de perguntas';

    protected static ?string $modelLabel = 'pergunta';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components(QuestionForm::components([
                Select::make('lesson_id')
                    ->label('Lição relacionada')
                    ->helperText('Quem errar é enviado para rever esta lição.')
                    ->relationship('lesson', 'title', fn ($query) => $query->where('trail_module_id', $this->getOwnerRecord()->getKey()))
                    ->required(fn ($get): bool => (bool) $get('is_checkpoint')),
                Toggle::make('is_checkpoint')
                    ->label('Verificação no fim da lição')
                    ->helperText('Desligado: entra no sorteio do quiz do módulo.')
                    ->live(),
            ]));
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('prompt')
            ->reorderable('position')
            ->defaultSort('position')
            ->columns([
                TextColumn::make('prompt')->label('Pergunta')->limit(70)->wrap()->searchable(),
                TextColumn::make('type')->label('Tipo')->badge(),
                TextColumn::make('lesson.title')->label('Lição')->limit(30)->placeholder('—'),
                IconColumn::make('is_checkpoint')->label('Verificação')->boolean(),
                IconColumn::make('is_active')->label('Activa')->boolean(),
            ])
            ->filters([
                TernaryFilter::make('is_checkpoint')->label('Uso')->trueLabel('Verificação de lição')->falseLabel('Quiz do módulo'),
            ])
            ->headerActions([
                CreateAction::make()->mutateDataUsing(fn (array $data): array => [
                    ...$data,
                    'position' => $this->getOwnerRecord()->questions()->max('position') + 1,
                ]),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
