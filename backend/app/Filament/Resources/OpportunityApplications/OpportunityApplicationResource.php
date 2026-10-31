<?php

namespace App\Filament\Resources\OpportunityApplications;

use App\Filament\Concerns\AdminOnly;
use App\Filament\Resources\OpportunityApplications\Pages\ListOpportunityApplications;
use App\Models\OpportunityApplication;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

/**
 * Lets the team move applications through the process so students see their real status.
 */
class OpportunityApplicationResource extends Resource
{
    use AdminOnly;

    protected static ?string $model = OpportunityApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInboxStack;

    protected static string|UnitEnum|null $navigationGroup = 'Oportunidades';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'candidatura';

    protected static ?string $pluralModelLabel = 'candidaturas';

    /**
     * @return array<string, string>
     */
    public static function statuses(): array
    {
        return ['registado' => 'Registada', 'em_analise' => 'Em análise', 'encaminhado' => 'Encaminhada à empresa', 'fechado' => 'Fechada'];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('opportunity.title')->label('Oportunidade')->searchable()->wrap(),
                TextColumn::make('opportunity.company.name')->label('Empresa'),
                TextColumn::make('user.profile.name')->label('Estudante')->placeholder('—')->searchable(),
                TextColumn::make('user.email')->label('Email')->searchable()->copyable(),
                TextColumn::make('type')->label('Tipo')->badge(),
                SelectColumn::make('status')->label('Estado')->options(self::statuses())->selectablePlaceholder(false),
                TextColumn::make('created_at')->label('Data')->date('d/m/Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->label('Estado')->options(self::statuses()),
                SelectFilter::make('opportunity')->label('Oportunidade')->relationship('opportunity', 'title'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOpportunityApplications::route('/'),
        ];
    }
}
