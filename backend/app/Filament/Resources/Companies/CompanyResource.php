<?php

namespace App\Filament\Resources\Companies;

use App\Filament\Concerns\AdminOnly;
use App\Filament\Resources\Companies\Pages\CreateCompany;
use App\Filament\Resources\Companies\Pages\EditCompany;
use App\Filament\Resources\Companies\Pages\ListCompanies;
use App\Models\Company;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class CompanyResource extends Resource
{
    use AdminOnly;

    protected static ?string $model = Company::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static string|UnitEnum|null $navigationGroup = 'Oportunidades';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'empresa';

    protected static ?string $pluralModelLabel = 'empresas';

    protected static ?string $recordTitleAttribute = 'name';

    /**
     * Shared with the inline "new company" form on opportunities.
     *
     * @return array<int, Component>
     */
    public static function formComponents(): array
    {
        return [
            TextInput::make('name')->label('Nome')->required()->maxLength(255)->live(onBlur: true)
                ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
            TextInput::make('slug')->label('Endereço (slug)')->required()->alphaDash()->unique('companies', 'slug', ignoreRecord: true),
            TextInput::make('area')->label('Área')->required(),
            TextInput::make('website')->label('Website')->url(),
            Textarea::make('description')->label('Descrição')->required()->rows(3)->columnSpanFull(),
            Textarea::make('culture')->label('Cultura')->rows(2)->columnSpanFull(),
            FileUpload::make('logo')->label('Logótipo')->image()->disk('public')->directory('companies')->maxSize(1024),
            Select::make('status')->label('Estado')->options(['publicado' => 'Publicada', 'rascunho' => 'Rascunho', 'arquivado' => 'Arquivada'])->default('publicado')->required(),
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(2)->components(self::formComponents());
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                ImageColumn::make('logo')->label('')->disk('public')->circular(),
                TextColumn::make('name')->label('Nome')->searchable()->sortable(),
                TextColumn::make('area')->label('Área')->searchable(),
                TextColumn::make('opportunities_count')->label('Oportunidades')->counts('opportunities'),
                TextColumn::make('status')->label('Estado')->badge(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCompanies::route('/'),
            'create' => CreateCompany::route('/create'),
            'edit' => EditCompany::route('/{record}/edit'),
        ];
    }
}
