<?php

namespace App\Filament\Resources\Trails\Pages;

use App\Filament\Resources\Trails\TrailResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTrails extends ListRecords
{
    protected static string $resource = TrailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
