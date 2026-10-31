<?php

namespace App\Filament\Resources\QuickLearnings\Pages;

use App\Filament\Resources\QuickLearnings\QuickLearningResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditQuickLearning extends EditRecord
{
    protected static string $resource = QuickLearningResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
