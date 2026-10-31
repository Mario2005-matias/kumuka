<?php

namespace App\Filament\Resources\TrailModules\RelationManagers;

use App\Filament\Resources\Lessons\LessonResource;
use App\Models\Lesson;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LessonsRelationManager extends RelationManager
{
    protected static string $relationship = 'lessons';

    protected static ?string $title = 'Lições';

    protected static ?string $modelLabel = 'lição';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')->label('Título')->required()->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->description('Lições curtas (até 10 minutos) funcionam melhor, sobretudo no telemóvel.')
            ->recordTitleAttribute('title')
            ->reorderable('position')
            ->defaultSort('position')
            ->columns([
                TextColumn::make('position')->label('#'),
                TextColumn::make('title')->label('Lição')->wrap(),
                TextColumn::make('duration_minutes')->label('Min.'),
                TextColumn::make('blocks_count')->label('Blocos')->counts('blocks'),
                TextColumn::make('checkpoint_questions_count')->label('Verificação')->counts('checkpointQuestions')
                    ->color(fn (int $state): string => $state === 0 ? 'warning' : 'success'),
                IconColumn::make('is_required')->label('Obrigatória')->boolean(),
            ])
            ->headerActions([
                CreateAction::make()
                    ->mutateDataUsing(fn (array $data): array => [
                        ...$data,
                        'position' => $this->getOwnerRecord()->lessons()->max('position') + 1,
                    ])
                    ->successRedirectUrl(fn (Lesson $record): string => LessonResource::getUrl('edit', ['record' => $record])),
            ])
            ->recordUrl(fn (Lesson $record): string => LessonResource::getUrl('edit', ['record' => $record]))
            ->recordActions([
                Action::make('open')
                    ->label('Editar conteúdo')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->url(fn (Lesson $record): string => LessonResource::getUrl('edit', ['record' => $record])),
                DeleteAction::make(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
