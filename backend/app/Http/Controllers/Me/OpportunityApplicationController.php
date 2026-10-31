<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\OpportunityApplicationResource;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class OpportunityApplicationController extends Controller
{
    /**
     * Applications and expressions of interest made by the student.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        return OpportunityApplicationResource::collection($request->user()->opportunityApplications()->latest()->get());
    }

    /**
     * Apply to, or register interest in, an open opportunity.
     */
    public function store(Request $request): OpportunityApplicationResource
    {
        $validated = $request->validate(['opportunityId' => ['required', 'integer', 'exists:opportunities,id']]);
        $opportunity = Opportunity::query()->findOrFail($validated['opportunityId']);

        if (! $opportunity->isOpen()) {
            throw ValidationException::withMessages(['opportunityId' => __('Esta oportunidade já não aceita candidaturas.')]);
        }

        $application = $request->user()->opportunityApplications()->firstOrCreate(
            ['opportunity_id' => $opportunity->id],
            ['type' => $opportunity->cta_type, 'status' => 'registado'],
        );

        return new OpportunityApplicationResource($application);
    }
}
