<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvailableCourse extends Model
{
    /** @use HasFactory<\Database\Factories\AvailableCourseFactory> */
    use HasFactory;

    protected $guarded = [''];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function student()
    {
        return $this->belongsToMany(Student::class);
    }
}
