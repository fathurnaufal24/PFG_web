<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassManagement extends Model
{
    use HasFactory;

    protected $table = 'class_management';

    protected $fillable = [
        'course_id',
        'teacher_id',
        'level',
        'period',
        'order',
        'type',
        'session',
        'student',
        'schedule_at',
        'note',
        'status',
        'preferred_day',
        'preferred_time',
    ];

    protected $casts = [
        'schedule_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function lessonPlan()
    {
        return $this->hasOne(LessonPlan::class);
    }

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function hasSchedule()
    {
        return $this->schedules()->count() > 0;
    }

    public function classStudents()
    {
        return $this->hasMany(ClassStudent::class, 'class_management_id');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'class_students', 'class_management_id', 'student_id')
            ->withPivot('id', 'status', 'notes', 'created_at')
            ->withTimestamps();
    }

    public function enrolledStudents()
    {
        return $this->students()->wherePivot('status', 'enrolled');
    }

    public function pendingStudents()
    {
        return $this->students()->wherePivot('status', 'pending');
    }
}