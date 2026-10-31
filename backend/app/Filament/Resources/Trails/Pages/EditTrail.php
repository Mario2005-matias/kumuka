<?php

namespace App\Filament\Resources\Trails\Pages;

use App\Filament\Resources\Trails\TrailResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTrail extends EditRecord
{
    protected static string $resource = TrailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
