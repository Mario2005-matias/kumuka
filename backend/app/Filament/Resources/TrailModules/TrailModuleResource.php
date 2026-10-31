<?php

namespace App\Filament\Resources\TrailModules;

use App\Enums\ActivityType;
use App\Filament\Resources\TrailModules\Pages\CreateTrailModule;
use App\Filament\Resources\TrailModules\Pages\EditTrailModule;
use App\Filament\Resources\TrailModules\Pages\ListTrailModules;
use App\Filament\Resources\TrailModules\RelationManagers\LessonsRelationManager;
use App\Filament\Resources\TrailModules\RelationManagers\QuestionsRelationManager;
use App\Models\TrailModule;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

/**
 * Modules are reached from their trail; this resource holds the lesson list, the question bank,
 * the quiz settings and the practical task.
 */
class TrailModuleResource extends Resource
{
    protected static ?string $model = TrailModule::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static string|UnitEnum|null $navigationGroup = 'Aprendizagem';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'módulo';

    protected static ?string $pluralModelLabel = 'módulos';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Módulo')
                    ->columns(2)
                    ->schema([
                        Select::make('trail_id')->label('Trilha')->relationship('trail', 'title')->required()->searchable()->preload(),
                        TextInput::make('title')->label('Título')->required()->maxLength(255),
                        Textarea::make('description')->label('Objectivo do módulo')->rows(2)->columnSpanFull(),
                        TextInput::make('duration_minutes')->label('Duração estimada (minutos)')->numeric()->minValue(0)->default(60),
                        TextInput::make('position')->label('Ordem')->numeric()->minValue(1)->required()->default(1),
                    ]),
                Section::make('Quiz do módulo')
                    ->description('No fim do módulo, o estudante responde a perguntas sorteadas do banco. Recomenda-se um banco com pelo menos o dobro das perguntas do quiz, para que cada tentativa seja diferente.')
                    ->columns(3)
                    ->schema([
                        TextInput::make('quiz_question_count')->label('Perguntas por tentativa')->numeric()->minValue(1)->maxValue(50)->required()->default(10),
                        TextInput::make('quiz_passing_score')->label('Nota mínima (%)')->numeric()->minValue(1)->maxValue(100)->required()->default(80),
                        TextInput::make('quiz_cooldown_minutes')->label('Espera após reprovar (min)')->numeric()->minValue(0)->maxValue(1440)->required()->default(5),
                    ]),
                Section::make('Tarefa prática')
                    ->description('Opcional. Aplica o que foi aprendido numa tarefa real (texto, link ou ficheiro).')
                    ->relationship('activity')
                    ->columns(2)
                    ->schema([
                        Select::make('type')->label('Tipo')->options(ActivityType::class)->required(),
                        TextInput::make('points')->label('Pontos')->numeric()->minValue(0)->default(20),
                        Textarea::make('prompt')->label('Enunciado')->required()->rows(2)->columnSpanFull(),
                        Textarea::make('instructions')->label('Instruções')->rows(3)->columnSpanFull(),
                        Toggle::make('is_required')->label('Obrigatória para concluir o módulo')->default(true),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('trail.title')->label('Trilha')->searchable()->sortable()->wrap(),
                TextColumn::make('position')->label('#')->sortable(),
                TextColumn::make('title')->label('Módulo')->searchable()->wrap(),
                TextColumn::make('lessons_count')->label('Lições')->counts('lessons'),
                TextColumn::make('quiz_questions_count')->label('Perguntas')->counts('quizQuestions')
                    ->color(fn (int $state): string => $state < 8 ? 'warning' : 'success'),
            ])
            ->defaultSort('trail_id')
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            LessonsRelationManager::class,
            QuestionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTrailModules::route('/'),
            'create' => CreateTrailModule::route('/create'),
            'edit' => EditTrailModule::route('/{record}/edit'),
        ];
    }
}
