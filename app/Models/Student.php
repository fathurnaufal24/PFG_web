<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'first_name',
        'last_name',
        'pob',
        'dob',
        'domicile',
        'card_number',
    ];

    public function users() {
        return $this->belongsTo(User::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function classStudents() {
        return $this->hasMany(ClassStudent::class, 'student_id');
    }

    public function classes() {
        return $this->belongsToMany(ClassManagement::class, 'class_students', 'student_id', 'class_management_id')
            ->withPivot('id', 'status', 'notes', 'created_at')
            ->withTimestamps();
    }

    public function enrolledClasses() {
        return $this->classes()->wherePivot('status', 'enrolled');
    }

    public function course_meetings() {
        return $this->hasMany(CourseMeeting::class);
    }

    public function attendances() {
        return $this->hasMany(Attendance::class);
    }

    public function courses() {
        return $this->hasMany(Course::class);
    }
}
