<?php

namespace App\Filament\Resources\QuickLearnings\Pages;

use App\Filament\Resources\QuickLearnings\QuickLearningResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListQuickLearnings extends ListRecords
{
    protected static string $resource = QuickLearningResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
