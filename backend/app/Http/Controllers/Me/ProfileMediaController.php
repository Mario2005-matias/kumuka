<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\StudentProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileMediaController extends Controller
{
    /**
     * Upload limits per image, in kilobytes, and the column each image is stored in.
     *
     * @var array<string, array{column: string, max: int}>
     */
    private const MEDIA = [
        'foto' => ['column' => 'photo', 'max' => 4096],
        'banner' => ['column' => 'banner', 'max' => 6144],
    ];

    /**
     * Replace the student's profile photo or banner.
     */
    public function store(Request $request, string $media): JsonResponse
    {
        $request->validate([
            'imagem' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.self::MEDIA[$media]['max']],
        ]);

        $profile = $request->user()->profile()->firstOrCreate();
        $column = self::MEDIA[$media]['column'];

        $this->deleteStoredFile($profile, $column);
        $profile->{$column} = $request->file('imagem')->store("profiles/{$profile->user_id}", 'public');
        $profile->save();

        return (new ProfileResource($profile))->response()->setStatusCode(200);
    }

    /**
     * Remove the student's profile photo or banner.
     */
    public function destroy(Request $request, string $media): JsonResponse
    {
        $profile = $request->user()->profile()->firstOrCreate();
        $column = self::MEDIA[$media]['column'];

        $this->deleteStoredFile($profile, $column);
        $profile->{$column} = null;
        $profile->save();

        return (new ProfileResource($profile))->response()->setStatusCode(200);
    }

    private function deleteStoredFile(StudentProfile $profile, string $column): void
    {
        $path = $profile->{$column};

        if ($path !== null && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }
}
