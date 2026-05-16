<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceFactory> */
    use HasFactory;

    public function course_meetings() {
        return $this->belongsTo(CourseMeeting::class);
    }

    public function students() {
        return $this->belongsTo(Student::class);
    }
}
