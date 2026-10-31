<?php

namespace App\Filament\Resources\Lessons\Pages;

use App\Filament\Resources\Lessons\LessonResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditLesson extends EditRecord
{
    protected static string $resource = LessonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('module')
                ->label('Voltar ao módulo')
                ->icon(Heroicon::OutlinedArrowUturnLeft)
                ->color('gray')
                ->url(fn (): string => LessonResource::moduleUrl($this->getRecord())),
            DeleteAction::make(),
        ];
    }
}
