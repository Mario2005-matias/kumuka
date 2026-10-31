<?php

namespace App\Http\Controllers;

use App\Http\Resources\TrailModuleResource;
use App\Models\Trail;
use App\Models\TrailModule;
use App\Services\TrailProgressService;
use Illuminate\Http\Request;

class TrailModuleController extends Controller
{
    /**
     * Full module content, available once the student is enrolled and the module is unlocked.
     */
    public function show(Request $request, Trail $trail, TrailModule $module, TrailProgressService $progress): TrailModuleResource
    {
        abort_unless($trail->status === 'published', 404);
        abort_unless($progress->canAccessModule($request->user(), $module), 403, __('Este módulo ainda está bloqueado.'));

        return new TrailModuleResource($module
            ->load(['lessons.blocks', 'lessons.checkpointQuestions', 'activity'])
            ->loadCount(['lessons', 'quizQuestions']));
    }
}
