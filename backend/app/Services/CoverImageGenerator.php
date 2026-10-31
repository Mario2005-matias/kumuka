<?php

namespace App\Services;

use Illuminate\Support\Str;

/**
 * Generates lightweight SVG cover art in the brand palette: a soft mesh of blurred colour
 * blobs behind a frosted-glass tile with a symbol for the subject. Output is deterministic
 * for a given seed, so regenerating keeps the same picture.
 */
class CoverImageGenerator
{
    /**
     * Symbol drawn on the glass tile, by keyword found in the category or area.
     *
     * @var array<string, string>
     */
    private const SYMBOLS = [
        'program' => '</>', 'web' => '</>', 'tecnolog' => '</>', 'dados' => 'Σ', 'excel' => 'Σ',
        'marketing' => '◎', 'comunica' => '❝', 'carreira' => 'CV', 'emprego' => 'CV',
        'lideran' => '★', 'finan' => 'Kz', 'banc' => 'Kz', 'empreend' => '↗', 'neg' => '↗',
        'design' => '◐', 'criativ' => '◐', 'produtiv' => '◷', 'telecom' => '◉', 'energia' => '⚡',
        'petr' => '⚡', 'saúde' => '✚', 'educa' => '✎',
    ];

    /**
     * Brand-derived palettes: [base, blob one, blob two, accent].
     *
     * @var list<array{string, string, string, string}>
     */
    private const PALETTES = [
        ['#0A1A2F', '#123B72', '#2F6FBF', '#F5BE35'],
        ['#123B72', '#1E5AA8', '#6FA8E8', '#F5BE35'],
        ['#0F2A4F', '#123B72', '#F5BE35', '#8FC1F2'],
        ['#0A1A2F', '#1A4C8F', '#4C9BE0', '#F2F6FA'],
    ];

    public function cover(string $seed, string $subject, int $width = 1200, int $height = 630): string
    {
        $hash = crc32($seed);
        [$base, $one, $two, $accent] = self::PALETTES[$hash % count(self::PALETTES)];
        $symbol = e($this->symbolFor($subject));
        $id = 'c'.dechex($hash);

        $x1 = 120 + $hash % 400;
        $x2 = $width - 200 - ($hash >> 8) % 300;
        $y2 = 120 + ($hash >> 16) % 300;
        $tile = (int) round($height * 0.42);
        $tileX = (int) round(($width - $tile) / 2);
        $tileY = (int) round(($height - $tile) / 2);
        $fontSize = (int) round($tile * (mb_strlen($this->symbolFor($subject)) > 2 ? 0.3 : 0.42));

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {$width} {$height}" role="img" aria-hidden="true">
  <defs>
    <filter id="{$id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter>
    <linearGradient id="{$id}g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.08"/>
    </linearGradient>
  </defs>
  <rect width="{$width}" height="{$height}" fill="{$base}"/>
  <g filter="url(#{$id}b)">
    <circle cx="{$x1}" cy="{$height}" r="320" fill="{$one}"/>
    <circle cx="{$x2}" cy="{$y2}" r="260" fill="{$two}" opacity="0.85"/>
    <circle cx="{$tileX}" cy="80" r="160" fill="{$accent}" opacity="0.55"/>
  </g>
  <rect x="{$tileX}" y="{$tileY}" width="{$tile}" height="{$tile}" rx="56" fill="url(#{$id}g)" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="-apple-system, 'SF Pro Display', 'Segoe UI', Poppins, sans-serif" font-weight="600" font-size="{$fontSize}" fill="#FFFFFF">{$symbol}</text>
</svg>
SVG;
    }

    /**
     * A round monogram for organisations without a logo.
     */
    public function monogram(string $name): string
    {
        [$base, $one, , $accent] = self::PALETTES[crc32($name) % count(self::PALETTES)];
        $initials = e(Str::upper(collect(preg_split('/\s+/', trim($name)) ?: [])->take(2)->map(fn (string $word): string => mb_substr($word, 0, 1))->implode('')));

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-hidden="true">
  <defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{$one}"/><stop offset="1" stop-color="{$base}"/></linearGradient></defs>
  <rect width="256" height="256" rx="64" fill="url(#m)"/>
  <circle cx="210" cy="46" r="34" fill="{$accent}" opacity="0.8"/>
  <text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-family="-apple-system, 'Segoe UI', Poppins, sans-serif" font-weight="700" font-size="96" fill="#FFFFFF">{$initials}</text>
</svg>
SVG;
    }

    private function symbolFor(string $subject): string
    {
        $subject = Str::lower($subject);

        foreach (self::SYMBOLS as $keyword => $symbol) {
            if (str_contains($subject, $keyword)) {
                return $symbol;
            }
        }

        return '✦';
    }
}
