<?php

namespace App\Filament\Resources\TrailModules\Pages;

use App\Filament\Resources\TrailModules\TrailModuleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTrailModules extends ListRecords
{
    protected static string $resource = TrailModuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
