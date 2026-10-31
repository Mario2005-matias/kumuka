<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\Experience;
use App\Models\Opportunity;
use App\Models\Trail;
use App\Services\CoverImageGenerator;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

#[Signature('kumuka:covers {--force : Replace generated covers that already exist}')]
#[Description('Generate brand cover images for trails, opportunities and experiences that have none, and logos for companies')]
class GenerateCovers extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(CoverImageGenerator $covers): int
    {
        $count = 0;

        foreach (Trail::query()->get() as $trail) {
            $count += $this->store($trail, 'image', "covers/trails/{$trail->slug}.svg", fn () => $covers->cover($trail->slug, $trail->category.' '.$trail->title));
        }

        foreach (Opportunity::query()->get() as $opportunity) {
            $count += $this->store($opportunity, 'banner', "covers/opportunities/{$opportunity->slug}.svg", fn () => $covers->cover($opportunity->slug, $opportunity->area.' '.$opportunity->title));
        }

        foreach (Experience::query()->get() as $experience) {
            $count += $this->store($experience, 'banner', "covers/experiences/{$experience->slug}.svg", fn () => $covers->cover($experience->slug, $experience->type.' '.$experience->title));
        }

        foreach (Company::query()->get() as $company) {
            $count += $this->store($company, 'logo', "covers/companies/{$company->slug}.svg", fn () => $covers->monogram($company->name));
        }

        $this->components->info("{$count} imagens geradas.");

        return self::SUCCESS;
    }

    /**
     * Store a generated image unless the record already has one (an upload is never replaced).
     */
    private function store(Model $record, string $attribute, string $path, callable $render): int
    {
        $current = $record->getAttribute($attribute);
        $isGenerated = is_string($current) && str_starts_with($current, 'covers/');

        if ($current !== null && ! ($isGenerated && $this->option('force'))) {
            return 0;
        }

        Storage::disk('public')->put($path, $render());
        $record->forceFill([$attribute => $path])->saveQuietly();

        return 1;
    }
}
