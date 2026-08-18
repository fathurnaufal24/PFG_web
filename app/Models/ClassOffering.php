<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassOffering extends Model
{
    use HasFactory;

    protected $fillable = [
        'curriculum_id',
        'course_id',
        'level',
        'period',
        'order',
        'type',
        'student',
        'schedule_at',
        'note',
        'is_archived',
        'close_offering',
    ];

    protected $casts = [
        'schedule_at' => 'datetime',
        'close_offering' => 'datetime',
        'is_archived' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function teacherApplications()
    {
        return $this->hasMany(ClassOfferingTeacher::class);
    }

    public function getAppliedTeachersAttribute()
    {
        return $this->teacherApplications()
            ->where('status', 'pending')
            ->with('teacher.user')
            ->get();
    }

    public function getAcceptedTeacherAttribute()
    {
        return $this->teacherApplications()
            ->where('status', 'accepted')
            ->with('teacher.user')
            ->first();
    }
}