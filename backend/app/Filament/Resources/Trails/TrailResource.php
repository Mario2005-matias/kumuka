<?php

namespace App\Filament\Resources\Trails;

use App\Filament\Resources\Trails\Pages\CreateTrail;
use App\Filament\Resources\Trails\Pages\EditTrail;
use App\Filament\Resources\Trails\Pages\ListTrails;
use App\Filament\Resources\Trails\RelationManagers\ModulesRelationManager;
use App\Filament\Resources\Trails\RelationManagers\PhasesRelationManager;
use App\Models\Trail;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
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
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class TrailResource extends Resource
{
    protected static ?string $model = Trail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Aprendizagem';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'trilha';

    protected static ?string $pluralModelLabel = 'trilhas';

    protected static ?string $recordTitleAttribute = 'title';

    /**
     * @return array<string, string>
     */
    public static function levels(): array
    {
        return ['iniciante' => 'Iniciante', 'intermedio' => 'Intermédio', 'avancado' => 'Avançado'];
    }

    /**
     * @return array<string, string>
     */
    public static function statuses(): array
    {
        return ['draft' => 'Rascunho', 'published' => 'Publicada', 'unpublished' => 'Despublicada'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Apresentação')
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                        TextInput::make('slug')
                            ->label('Endereço (slug)')
                            ->helperText('Aparece no link: /aprender/trilhas/slug')
                            ->required()
                            ->alphaDash()
                            ->unique(ignoreRecord: true),
                        Textarea::make('summary')->label('Resumo (1–2 frases)')->required()->rows(2)->columnSpanFull(),
                        Textarea::make('description')->label('Descrição completa')->required()->rows(6)->columnSpanFull(),
                        FileUpload::make('image')->label('Imagem de capa')->image()->disk('public')->directory('trails')->maxSize(2048),
                    ]),
                Section::make('Resultado de aprendizagem')
                    ->columns(2)
                    ->schema([
                        TextInput::make('category')->label('Categoria')->required(),
                        TextInput::make('core_competence')->label('Competência central')->required(),
                        Textarea::make('expected_outcome')->label('Resultado esperado')->helperText('O que o estudante consegue fazer no fim. Ex.: "Montar um dashboard de vendas em Excel".')->required()->rows(2)->columnSpanFull(),
                        TagsInput::make('learning_objectives')->label('Objectivos de aprendizagem')->columnSpanFull(),
                        TagsInput::make('prerequisites')->label('Pré-requisitos'),
                        Textarea::make('target_audience')->label('Para quem é')->rows(2),
                    ]),
                Section::make('Publicação')
                    ->columns(3)
                    ->schema([
                        Select::make('level')->label('Nível')->options(self::levels())->required()->default('iniciante'),
                        TextInput::make('duration_minutes')->label('Duração estimada (minutos)')->numeric()->minValue(0)->required()->default(60),
                        Select::make('status')->label('Estado')->options(self::statuses())->required()->default('draft'),
                        Select::make('access')->label('Acesso')->options(['free' => 'Gratuito', 'premium' => 'Premium', 'paid' => 'Pago'])->required()->default('free'),
                        TextInput::make('price')->label('Preço (Kz)')->numeric()->minValue(0),
                        Toggle::make('has_certificate')->label('Emite certificado'),
                        Toggle::make('is_sequential')->label('Módulos desbloqueiam por ordem')->default(true),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Título')->searchable()->sortable()->wrap(),
                TextColumn::make('category')->label('Categoria')->searchable()->badge(),
                TextColumn::make('level')->label('Nível')->formatStateUsing(fn (string $state): string => self::levels()[$state] ?? $state),
                TextColumn::make('modules_count')->label('Módulos')->counts('modules')->sortable(),
                TextColumn::make('enrollments_count')->label('Inscritos')->counts('enrollments')->sortable(),
                TextColumn::make('status')->label('Estado')->badge()
                    ->formatStateUsing(fn (string $state): string => self::statuses()[$state] ?? $state)
                    ->color(fn (string $state): string => $state === 'published' ? 'success' : 'gray'),
                IconColumn::make('has_certificate')->label('Certificado')->boolean(),
                TextColumn::make('updated_at')->label('Actualizada')->since()->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->filters([
                SelectFilter::make('status')->label('Estado')->options(self::statuses()),
                SelectFilter::make('level')->label('Nível')->options(self::levels()),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            PhasesRelationManager::class,
            ModulesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTrails::route('/'),
            'create' => CreateTrail::route('/create'),
            'edit' => EditTrail::route('/{record}/edit'),
        ];
    }
}
