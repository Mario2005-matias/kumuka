<?php

namespace App\Filament\Resources\Opportunities;

use App\Filament\Concerns\AdminOnly;
use App\Filament\Resources\Companies\CompanyResource;
use App\Filament\Resources\Opportunities\Pages\CreateOpportunity;
use App\Filament\Resources\Opportunities\Pages\EditOpportunity;
use App\Filament\Resources\Opportunities\Pages\ListOpportunities;
use App\Models\Opportunity;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class OpportunityResource extends Resource
{
    use AdminOnly;

    protected static ?string $model = Opportunity::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBriefcase;

    protected static string|UnitEnum|null $navigationGroup = 'Oportunidades';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'oportunidade';

    protected static ?string $pluralModelLabel = 'oportunidades';

    protected static ?string $recordTitleAttribute = 'title';

    /**
     * @return array<string, string>
     */
    public static function types(): array
    {
        return [
            'estagio' => 'Estágio', 'emprego' => 'Emprego', 'trainee' => 'Trainee', 'bolsa' => 'Bolsa',
            'programa' => 'Programa', 'mentoria' => 'Mentoria', 'desafio' => 'Desafio',
            'concurso' => 'Concurso', 'voluntariado' => 'Voluntariado',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function modalities(): array
    {
        return ['presencial' => 'Presencial', 'online' => 'Online', 'hibrido' => 'Híbrido'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Oportunidade')
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')->label('Título')->required()->maxLength(255)->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                        TextInput::make('slug')->label('Endereço (slug)')->required()->alphaDash()->unique(ignoreRecord: true),
                        Select::make('company_id')->label('Empresa')->relationship('company', 'name')->searchable()->preload()->required()
                            ->createOptionForm(CompanyResource::formComponents()),
                        Select::make('type')->label('Tipo')->options(self::types())->required(),
                        TextInput::make('subtitle')->label('Subtítulo'),
                        TextInput::make('area')->label('Área')->required(),
                        Textarea::make('summary')->label('Resumo')->required()->rows(2)->columnSpanFull(),
                        Textarea::make('description')->label('Descrição completa')->required()->rows(5)->columnSpanFull(),
                    ]),
                Section::make('Detalhes')
                    ->columns(2)
                    ->schema([
                        TextInput::make('location')->label('Localização')->required(),
                        Select::make('modality')->label('Modalidade')->options(self::modalities())->required(),
                        DateTimePicker::make('deadline_at')->label('Prazo de candidatura')->required()->native(false),
                        Select::make('status')->label('Estado')->options(['aberta' => 'Aberta', 'fechada' => 'Fechada'])->default('aberta')->required(),
                        TagsInput::make('responsibilities')->label('Responsabilidades')->columnSpanFull(),
                        TagsInput::make('requirements')->label('Requisitos')->columnSpanFull(),
                        TagsInput::make('benefits')->label('Benefícios')->columnSpanFull(),
                        Select::make('cta_type')->label('Acção do estudante')->options(['candidatura' => 'Candidatura', 'interesse' => 'Manifestar interesse'])->default('candidatura')->required(),
                        TextInput::make('cta_url')->label('Link externo (opcional)')->url(),
                        FileUpload::make('banner')->label('Banner')->image()->disk('public')->directory('opportunities')->maxSize(2048)->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Título')->searchable()->wrap(),
                TextColumn::make('company.name')->label('Empresa')->searchable(),
                TextColumn::make('type')->label('Tipo')->badge()->formatStateUsing(fn (string $state): string => self::types()[$state] ?? $state),
                TextColumn::make('deadline_at')->label('Prazo')->date('d/m/Y')->sortable()
                    ->color(fn (Opportunity $record): string => $record->deadline_at->isPast() ? 'danger' : 'gray'),
                TextColumn::make('applications_count')->label('Candidaturas')->counts('applications')->sortable(),
                TextColumn::make('status')->label('Estado')->badge()->color(fn (string $state): string => $state === 'aberta' ? 'success' : 'gray'),
            ])
            ->defaultSort('deadline_at', 'desc')
            ->filters([
                SelectFilter::make('type')->label('Tipo')->options(self::types()),
                SelectFilter::make('company')->label('Empresa')->relationship('company', 'name'),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOpportunities::route('/'),
            'create' => CreateOpportunity::route('/create'),
            'edit' => EditOpportunity::route('/{record}/edit'),
        ];
    }
}
