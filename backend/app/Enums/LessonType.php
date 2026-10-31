<?php

namespace App\Enums;

enum LessonType: string
{
    case Text = 'texto';
    case Video = 'video';
    case Image = 'imagem';
    case Link = 'link';
}
