<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseMeeting extends Model
{
    /** @use HasFactory<\Database\Factories\CourseMeetingFactory> */
    use HasFactory;

    public function courses() {
        return $this->belongsTo(Course::class);
    }

    public function attendances() {
        return $this->hasMany(Attendance::class);
    }
}
