<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Models\LessonBlock;
use App\Services\TrailProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlockHeartbeatController extends Controller
{
    /**
     * Report the playback position of a video block, roughly every ten seconds while playing.
     */
    public function store(Request $request, LessonBlock $block, TrailProgressService $progress): JsonResponse
    {
        $validated = $request->validate(['position' => ['required', 'numeric', 'min:0', 'max:86400']]);

        abort_unless($block->isTracked(), 422, __('Este bloco não é acompanhado.'));
        abort_unless($progress->canAccessModule($request->user(), $block->lesson->module), 403, __('Este módulo ainda está bloqueado.'));

        $blockProgress = $progress->recordVideoHeartbeat($request->user(), $block, ['position' => $validated['position']]);

        return response()->json(['data' => [
            'blockId' => (string) $block->id,
            'percentual' => $progress->watchedPercent($block, $blockProgress),
            'posicao' => $blockProgress->last_position_seconds,
            'concluido' => $blockProgress->completed_at !== null,
        ]]);
    }
}
