<?php

namespace App\Filament\Resources\TrailModules\Pages;

use App\Filament\Resources\TrailModules\TrailModuleResource;
use App\Filament\Resources\Trails\TrailResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditTrailModule extends EditRecord
{
    protected static string $resource = TrailModuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('trail')
                ->label('Voltar à trilha')
                ->icon(Heroicon::OutlinedArrowUturnLeft)
                ->color('gray')
                ->url(fn (): string => TrailResource::getUrl('edit', ['record' => $this->getRecord()->trail_id])),
            DeleteAction::make(),
        ];
    }
}
