<?php

namespace App\Filament\Resources\Lessons;

use App\Enums\LessonType;
use App\Filament\Resources\Lessons\Pages\CreateLesson;
use App\Filament\Resources\Lessons\Pages\EditLesson;
use App\Filament\Resources\Lessons\Pages\ListLessons;
use App\Filament\Resources\TrailModules\TrailModuleResource;
use App\Filament\Support\TableActions;
use App\Models\Lesson;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

/**
 * A lesson is an ordered list of content blocks. Its checkpoint questions live in the module's
 * question bank.
 */
class LessonResource extends Resource
{
    protected static ?string $model = Lesson::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBookOpen;

    protected static string|UnitEnum|null $navigationGroup = 'Aprendizagem';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'lição';

    protected static ?string $pluralModelLabel = 'lições';

    protected static ?string $navigationLabel = 'Lições';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        $type = fn (Get $get): ?LessonType => $get('type') instanceof LessonType ? $get('type') : LessonType::tryFrom((string) $get('type'));
        $is = fn (LessonType ...$types) => fn (Get $get): bool => in_array($type($get), $types, true);

        return $schema
            ->components([
                Section::make('Lição')
                    ->columns(2)
                    ->schema([
                        Select::make('trail_module_id')->label('Módulo')->relationship('module', 'title')->required()->searchable()->preload(),
                        TextInput::make('title')->label('Título')->required()->maxLength(255),
                        Textarea::make('summary')->label('Resumo')->helperText('Uma frase sobre o que se aprende nesta lição.')->rows(2)->columnSpanFull(),
                        TextInput::make('duration_minutes')->label('Duração (minutos)')->numeric()->minValue(1)->default(5)->required(),
                        TextInput::make('position')->label('Ordem')->numeric()->minValue(1)->default(1)->required(),
                        TextInput::make('completion_threshold')->label('% mínima de cada vídeo')->numeric()->minValue(10)->maxValue(100)->default(90)->required(),
                        Toggle::make('is_required')->label('Obrigatória')->default(true)->inline(false),
                    ]),
                Section::make('Conteúdo')
                    ->description('Organiza a lição em blocos: explicação, exemplo resolvido, vídeo, PDF… A lição conclui-se quando o estudante assiste aos vídeos e acerta a verificação (definida no banco de perguntas do módulo).')
                    ->schema([
                        Repeater::make('blocks')
                            ->hiddenLabel()
                            ->relationship()
                            ->orderColumn('position')
                            ->reorderable()
                            ->collapsible()
                            ->itemLabel(fn (array $state): string => self::blockLabel($state))
                            ->addActionLabel('Adicionar bloco')
                            ->defaultItems(1)
                            ->schema([
                                Select::make('type')->label('Tipo')->options(LessonType::class)->default(LessonType::Text)->required()->live(),
                                TextInput::make('title')->label('Título do bloco (opcional)'),
                                MarkdownEditor::make('body')
                                    ->label(fn (Get $get): string => $is(LessonType::Text)($get) ? 'Texto' : 'Texto de apoio (opcional)')
                                    ->required($is(LessonType::Text))
                                    ->toolbarButtons([['bold', 'italic', 'link'], ['heading'], ['bulletList', 'orderedList', 'blockquote'], ['undo', 'redo']])
                                    ->columnSpanFull(),
                                TextInput::make('media_url')
                                    ->label(fn (Get $get): string => $is(LessonType::Video)($get) ? 'Link do vídeo (YouTube ou ficheiro .mp4)' : 'Endereço (URL)')
                                    ->url()
                                    ->required($is(LessonType::Video, LessonType::Link))
                                    ->visible($is(LessonType::Video, LessonType::Link)),
                                TextInput::make('duration_seconds')
                                    ->label('Duração do vídeo (segundos)')
                                    ->helperText('Necessária para acompanhar quanto do vídeo foi visto.')
                                    ->numeric()
                                    ->minValue(1)
                                    ->required($is(LessonType::Video))
                                    ->visible($is(LessonType::Video)),
                                FileUpload::make('file_path')
                                    ->label(fn (Get $get): string => $is(LessonType::Pdf)($get) ? 'Ficheiro PDF' : 'Imagem')
                                    ->disk('public')
                                    ->directory('lessons')
                                    ->acceptedFileTypes(fn (Get $get): array => $is(LessonType::Pdf)($get) ? ['application/pdf'] : ['image/jpeg', 'image/png', 'image/webp'])
                                    ->maxSize(10240)
                                    ->required($is(LessonType::Pdf, LessonType::Image))
                                    ->visible($is(LessonType::Pdf, LessonType::Image))
                                    ->columnSpanFull(),
                            ])
                            ->columns(2),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('module.trail.title')->label('Trilha')->limit(30),
                TextColumn::make('module.title')->label('Módulo')->limit(30),
                TextColumn::make('position')->label('#'),
                TextColumn::make('title')->label('Lição')->searchable()->wrap(),
                TextColumn::make('blocks_count')->label('Blocos')->counts('blocks'),
                TextColumn::make('checkpoint_questions_count')->label('Verificação')->counts('checkpointQuestions')
                    ->color(fn (int $state): string => $state === 0 ? 'warning' : 'success'),
            ])
            ->recordActions(TableActions::row())
            ->toolbarActions(TableActions::bulk());
    }

    /**
     * Collapsed title of a content block in the editor.
     *
     * @param  array<string, mixed>  $state
     */
    public static function blockLabel(array $state): string
    {
        $type = $state['type'] instanceof LessonType ? $state['type'] : LessonType::tryFrom((string) ($state['type'] ?? ''));

        return collect([$type?->getLabel() ?? 'Bloco', $state['title'] ?? null])->filter()->implode(' · ');
    }

    /**
     * Link back to the module that owns the lesson.
     */
    public static function moduleUrl(Lesson $lesson): string
    {
        return TrailModuleResource::getUrl('edit', ['record' => $lesson->trail_module_id]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLessons::route('/'),
            'create' => CreateLesson::route('/create'),
            'edit' => EditLesson::route('/{record}/edit'),
        ];
    }
}
