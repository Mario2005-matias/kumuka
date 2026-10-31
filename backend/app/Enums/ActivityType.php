<?php

namespace App\Enums;

enum ActivityType: string
{
    case Writing = 'escrita';
    case Upload = 'upload';
    case Link = 'link';
    case Quiz = 'quiz';
}
