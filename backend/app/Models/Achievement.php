<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

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
}
