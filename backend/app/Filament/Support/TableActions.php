<?php

namespace App\Filament\Support;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Filters\TrashedFilter;

/**
 * The same row and bulk actions on every admin table, so every list offers full CRUD.
 *
 * On models with soft deletes, "Eliminar" archives the record; "Restaurar" and
 * "Eliminar definitivamente" appear for archived records.
 */
class TableActions
{
    /**
     * @param  array<int, Action>  $extra  Actions shown before the standard ones.
     * @return array<int, Action>
     */
    public static function row(array $extra = [], bool $view = false): array
    {
        return [
            ...$extra,
            ...($view ? [ViewAction::make()] : []),
            EditAction::make(),
            DeleteAction::make(),
            RestoreAction::make(),
            ForceDeleteAction::make(),
        ];
    }

    /**
     * @return array<int, BulkActionGroup>
     */
    public static function bulk(): array
    {
        return [
            BulkActionGroup::make([
                DeleteBulkAction::make(),
                RestoreBulkAction::make(),
                ForceDeleteBulkAction::make(),
            ]),
        ];
    }

    public static function trashedFilter(): TrashedFilter
    {
        return TrashedFilter::make()->label('Arquivados');
    }
}
