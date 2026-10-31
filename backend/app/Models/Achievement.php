<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['code', 'title', 'description'])]
class Achievement extends Model
{
    public const PROFILE_COMPLETED = 'perfil-completo';

    public const FIRST_LEARNING = 'primeira-aprendizagem';

    public const FIRST_ACTIVITY = 'primeira-actividade';

    public const FIRST_PROJECT = 'primeiro-projecto';

    public const FIRST_EXPERIENCE = 'primeira-experiencia';

    public const FIRST_CERTIFICATE = 'primeiro-certificado';

    public const FIRST_TRAIL = 'primeira-trilha';

    /**
     * Codes the platform unlocks automatically; they cannot be renamed or deleted.
     */
    public const SYSTEM_CODES = [
        self::PROFILE_COMPLETED, self::FIRST_LEARNING, self::FIRST_ACTIVITY, self::FIRST_PROJECT,
        self::FIRST_EXPERIENCE, self::FIRST_CERTIFICATE, self::FIRST_TRAIL,
    ];

    /**
     * @return BelongsToMany<User, $this>
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('unlocked_at');
    }

    /**
     * Whether the platform relies on this achievement's code.
     */
    public function isSystem(): bool
    {
        return in_array($this->code, self::SYSTEM_CODES, true);
    }
}
