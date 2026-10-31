<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\JsonResponse;

class FaqController extends Controller
{
    /**
     * Published questions grouped by category order, plus the support contact. Public.
     */
    public function index(): JsonResponse
    {
        $faqs = Faq::query()->published()->orderBy('category')->orderBy('position')->get();

        return response()->json([
            'data' => $faqs->map(fn (Faq $faq): array => [
                'id' => (string) $faq->id,
                'categoria' => $faq->category,
                'pergunta' => $faq->question,
                'resposta' => $faq->answer,
            ])->values(),
            'suporte' => ['email' => config('app.support_email')],
        ]);
    }
}
