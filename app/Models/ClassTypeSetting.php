<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassTypeSetting extends Model
{
    public const TYPES = ['trial', 'regular', 'private'];

    protected $fillable = ['type', 'max_student'];

    public static function maxStudentFor(string $type): int
    {
        return (int) static::where('type', $type)->value('max_student');
    }
}
