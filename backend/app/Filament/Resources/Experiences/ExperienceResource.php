<?php

namespace App\Filament\Resources\Experiences;

use App\Filament\Concerns\AdminOnly;
use App\Filament\Concerns\ArchivesRecords;
use App\Filament\Resources\Experiences\Pages\CreateExperience;
use App\Filament\Resources\Experiences\Pages\EditExperience;
use App\Filament\Resources\Experiences\Pages\ListExperiences;
use App\Filament\Resources\Experiences\RelationManagers\RegistrationsRelationManager;
use App\Filament\Support\TableActions;
use App\Models\Experience;
use BackedEnum;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class ExperienceResource extends Resource
{
    use AdminOnly, ArchivesRecords;

    protected static ?string $model = Experience::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    protected static string|UnitEnum|null $navigationGroup = 'Comunidade';

    protected static ?string $modelLabel = 'experiência';

    protected static ?string $pluralModelLabel = 'experiências';

    protected static ?string $navigationLabel = 'Experiências';

    protected static ?string $recordTitleAttribute = 'title';

    /**
     * @return array<string, string>
     */
    public static function types(): array
    {
        return ['programa' => 'Programa', 'workshop' => 'Workshop', 'evento' => 'Evento', 'mentoria' => 'Mentoria', 'desafio' => 'Desafio', 'visita' => 'Visita'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Experiência')
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')->label('Título')->required()->maxLength(255)->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                        TextInput::make('slug')->label('Endereço (slug)')->required()->alphaDash()->unique(ignoreRecord: true),
                        Select::make('type')->label('Tipo')->options(self::types())->required(),
                        TextInput::make('subtitle')->label('Subtítulo'),
                        TextInput::make('organizer')->label('Organizador')->required(),
                        Select::make('company_id')->label('Empresa parceira')->relationship('company', 'name')->searchable()->preload(),
                        Textarea::make('summary')->label('Resumo')->required()->rows(2)->columnSpanFull(),
                        Textarea::make('description')->label('Descrição completa')->required()->rows(5)->columnSpanFull(),
                    ]),
                Section::make('Quando e onde')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('starts_at')->label('Início')->required()->native(false),
                        DateTimePicker::make('ends_at')->label('Fim')->native(false)->after('starts_at'),
                        TextInput::make('location')->label('Local')->required(),
                        TextInput::make('location_details')->label('Morada / detalhes'),
                        Select::make('modality')->label('Modalidade')->options(['presencial' => 'Presencial', 'online' => 'Online', 'hibrido' => 'Híbrido'])->required(),
                        TextInput::make('capacity')->label('Vagas')->numeric()->minValue(1)->required(),
                        Toggle::make('is_closed')->label('Inscrições fechadas'),
                    ]),
                Section::make('Programa e oradores')
                    ->collapsed()
                    ->schema([
                        TagsInput::make('benefits')->label('Benefícios'),
                        TagsInput::make('requirements')->label('Requisitos'),
                        Repeater::make('schedule')->label('Programa')->schema([
                            TextInput::make('hora')->label('Hora')->required(),
                            TextInput::make('titulo')->label('Actividade')->required(),
                            TextInput::make('descricao')->label('Descrição'),
                        ])->columns(3)->defaultItems(0),
                        Repeater::make('speakers')->label('Oradores')->schema([
                            TextInput::make('nome')->label('Nome')->required(),
                            TextInput::make('cargo')->label('Cargo'),
                            TextInput::make('empresa')->label('Empresa'),
                            Textarea::make('bio')->label('Bio')->rows(2)->columnSpanFull(),
                        ])->columns(3)->defaultItems(0),
                        FileUpload::make('banner')->label('Banner')->image()->disk('public')->directory('experiences')->maxSize(2048),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Título')->searchable()->wrap(),
                TextColumn::make('type')->label('Tipo')->badge()->formatStateUsing(fn (string $state): string => self::types()[$state] ?? $state),
                TextColumn::make('starts_at')->label('Data')->dateTime('d/m/Y H:i')->sortable(),
                TextColumn::make('registrations_count')->label('Inscritos')->counts('registrations')
                    ->formatStateUsing(fn (int $state, Experience $record): string => "{$state} / {$record->capacity}"),
                TextColumn::make('location')->label('Local'),
            ])
            ->defaultSort('starts_at', 'desc')
            ->filters([TableActions::trashedFilter()])
            ->recordActions(TableActions::row())
            ->toolbarActions(TableActions::bulk());
    }

    public static function getRelations(): array
    {
        return [
            RegistrationsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExperiences::route('/'),
            'create' => CreateExperience::route('/create'),
            'edit' => EditExperience::route('/{record}/edit'),
        ];
    }
}
