<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Experience;
use App\Models\Opportunity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Seeds companies, opportunities and experiences from the Angolan sample content.
 */
class OpportunitySeeder extends Seeder
{
    use ReadsSeedData;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companyIds = [];

        foreach ($this->seedData('companies') as $company) {
            $companyIds[$company['id']] = Company::updateOrCreate(['slug' => $company['slug']], [
                'name' => $company['nome'],
                'logo' => $company['logo'],
                'description' => $company['descricao'],
                'area' => $company['area'],
                'website' => $company['website'],
                'culture' => $company['cultura'],
                'status' => $company['status'],
            ])->id;
        }

        foreach ($this->seedData('opportunities') as $opportunity) {
            Opportunity::updateOrCreate(['slug' => $opportunity['slug']], [
                'company_id' => $companyIds[$opportunity['empresaId']],
                'title' => $opportunity['titulo'],
                'subtitle' => $opportunity['subtitulo'],
                'summary' => $opportunity['descricao'],
                'description' => $opportunity['descricaoLonga'],
                'type' => $opportunity['tipo'],
                'area' => $opportunity['area'],
                'location' => $opportunity['localizacao'],
                'modality' => $opportunity['modalidade'],
                'responsibilities' => $opportunity['responsabilidades'],
                'requirements' => $opportunity['requisitos'],
                'benefits' => $opportunity['beneficios'],
                'deadline_at' => Carbon::parse($opportunity['prazo'])->endOfDay(),
                'cta_type' => $opportunity['ctaTipo'],
                'cta_url' => $opportunity['ctaDestino'],
                'status' => $opportunity['estado'] === 'fechada' ? 'fechada' : 'aberta',
                'banner' => $opportunity['banner'],
            ]);
        }

        foreach ($this->seedData('experiences') as $experience) {
            Experience::updateOrCreate(['slug' => $experience['slug']], [
                'company_id' => $companyIds[$experience['empresaId'] ?? ''] ?? null,
                'title' => $experience['titulo'],
                'subtitle' => $experience['subtitulo'],
                'summary' => $experience['descricao'],
                'description' => $experience['descricaoLonga'],
                'type' => $experience['tipo'],
                'organizer' => $experience['organizador'],
                'organizer_logo' => $experience['organizadorLogo'],
                'starts_at' => Carbon::parse("{$experience['data']} {$experience['hora']}"),
                'ends_at' => $experience['dataFim'] === null ? null : Carbon::parse($experience['dataFim'])->endOfDay(),
                'location' => $experience['local'],
                'location_details' => $experience['localDetalhado'],
                'modality' => $experience['modalidade'],
                'benefits' => $experience['beneficios'],
                'requirements' => $experience['requisitos'],
                'schedule' => $experience['programa'],
                'speakers' => $experience['oradores'],
                'capacity' => $experience['vagas'],
                'is_closed' => $experience['estado'] === 'encerrada',
                'banner' => $experience['banner'],
                'gallery' => $experience['galeria'],
            ]);
        }
    }
}
