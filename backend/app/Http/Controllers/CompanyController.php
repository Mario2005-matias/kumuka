<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompanyResource;
use App\Models\Company;

class CompanyController extends Controller
{
    /**
     * A single company.
     */
    public function show(Company $company): CompanyResource
    {
        return new CompanyResource($company);
    }
}
