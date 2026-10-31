<?php

namespace App\Filament\Concerns;

use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

/**
 * For resources whose models use soft deletes: archived records stay reachable from the
 * "Arquivados" filter so they can be opened, restored or deleted for good.
 */
trait ArchivesRecords
{
    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()->withoutGlobalScopes([SoftDeletingScope::class]);
    }

    /**
     * Header actions for edit pages of archivable records.
     *
     * @return array<int, RestoreAction|ForceDeleteAction>
     */
    public static function archiveHeaderActions(): array
    {
        return [
            RestoreAction::make(),
            ForceDeleteAction::make()->modalDescription('Apaga o registo para sempre, incluindo o histórico associado. Esta acção não pode ser desfeita.'),
        ];
    }
}
