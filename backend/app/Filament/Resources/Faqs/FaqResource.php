<?php

namespace App\Filament\Resources\Faqs;

use App\Filament\Resources\Faqs\Pages\CreateFaq;
use App\Filament\Resources\Faqs\Pages\EditFaq;
use App\Filament\Resources\Faqs\Pages\ListFaqs;
use App\Filament\Support\TableActions;
use App\Models\Faq;
use BackedEnum;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class FaqResource extends Resource
{
    protected static ?string $model = Faq::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQuestionMarkCircle;

    protected static string|UnitEnum|null $navigationGroup = 'Comunidade';

    protected static ?string $modelLabel = 'pergunta frequente';

    protected static ?string $pluralModelLabel = 'perguntas frequentes';

    protected static ?string $navigationLabel = 'Perguntas frequentes';

    protected static ?string $recordTitleAttribute = 'question';

    /**
     * Categories already in use, offered as suggestions.
     *
     * @return array<string, string>
     */
    public static function categories(): array
    {
        return Faq::query()->distinct()->orderBy('category')->pluck('category', 'category')->all();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Select::make('category')
                    ->label('Categoria')
                    ->options(fn (): array => self::categories())
                    ->searchable()
                    ->createOptionForm([TextInput::make('category')->label('Nova categoria')->required()])
                    ->createOptionUsing(fn (array $data): string => $data['category'])
                    ->required(),
                TextInput::make('position')->label('Ordem')->numeric()->default(0),
                TextInput::make('question')->label('Pergunta')->required()->maxLength(255)->columnSpanFull(),
                Textarea::make('answer')->label('Resposta')->required()->rows(5)->columnSpanFull(),
                Toggle::make('is_published')->label('Publicada')->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('question')
            ->reorderable('position')
            ->defaultSort('position')
            ->columns([
                TextColumn::make('question')->label('Pergunta')->searchable()->wrap(),
                TextColumn::make('category')->label('Categoria')->badge()->searchable(),
                IconColumn::make('is_published')->label('Publicada')->boolean(),
            ])
            ->filters([
                SelectFilter::make('category')->label('Categoria')->options(fn (): array => self::categories()),
            ])
            ->recordActions(TableActions::row())
            ->toolbarActions(TableActions::bulk());
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFaqs::route('/'),
            'create' => CreateFaq::route('/create'),
            'edit' => EditFaq::route('/{record}/edit'),
        ];
    }
}
