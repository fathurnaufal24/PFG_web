<?php

namespace App\Http\Controllers;

use App\Models\ClassManagement;
use App\Models\ClassSchedule;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = $user->role;
        $teacherData = null;
        $studentData = null;
        $isAdmin = false;
        $stats = [];

        if ($role === 'admin') {
            $isAdmin = true;
            $teacherData = null;
            $stats = [
                'totalClasses' => ClassManagement::count(),
                'totalTeachers' => Teacher::count(),
                'totalStudents' => Student::count(),
            ];
        } else if ($role === 'teacher') {
            $user->load('teacher');
            $teacherData = $user->teacher;
        } else if ($role === 'student') {
            $user->load('student');
            $student = $user->student;

            if ($student) {
                $enrolledClasses = $student->classes()->wherePivot('status', 'enrolled')->with(['course', 'teacher.user', 'schedules'])->get();
                $pendingClasses = $student->classes()->wherePivot('status', 'pending')->with(['course', 'teacher.user'])->get();

                $classIds = $enrolledClasses->pluck('id');
                $nextSchedule = ClassSchedule::whereIn('class_management_id', $classIds)
                    ->where('schedule_at', '>=', now())
                    ->orderBy('schedule_at', 'asc')
                    ->with('classManagement.course')
                    ->first();

                $studentData = [
                    'id' => $student->id,
                    'name' => $student->name,
                    'enrolled_classes' => $enrolledClasses->map(function ($c) {
                        return [
                            'id' => $c->id,
                            'subject' => $c->course?->subject ?? 'N/A',
                            'level' => $c->level,
                            'type' => $c->type,
                            'teacher_name' => $c->teacher ? trim($c->teacher->first_name . ' ' . ($c->teacher->last_name ?? '')) : 'Belum Ditentukan',
                            'schedule_at' => $c->schedule_at ? $c->schedule_at->format('d M Y - H:i') . ' WIB' : ($c->preferred_day ? $c->preferred_day . ' ' . $c->preferred_time : '-'),
                            'status' => $c->status,
                            'session' => $c->session,
                        ];
                    }),
                    'pending_classes' => $pendingClasses->map(function ($c) {
                        return [
                            'id' => $c->id,
                            'subject' => $c->course?->subject ?? 'N/A',
                            'level' => $c->level,
                            'type' => $c->type,
                            'teacher_name' => $c->teacher ? trim($c->teacher->first_name . ' ' . ($c->teacher->last_name ?? '')) : 'Belum Ditentukan',
                            'status' => 'pending',
                        ];
                    }),
                    'stats' => [
                        'enrolled_count' => $enrolledClasses->count(),
                        'pending_count' => $pendingClasses->count(),
                        'next_schedule' => $nextSchedule ? [
                            'subject' => $nextSchedule->classManagement?->course?->subject ?? 'Class',
                            'meeting_number' => $nextSchedule->meeting_number,
                            'date' => $nextSchedule->schedule_at ? $nextSchedule->schedule_at->locale('id')->translatedFormat('l, d F Y - H.i') . ' WIB' : '-',
                        ] : null,
                    ],
                ];
            }
        }

        return Inertia::render('Dashboard', [
            'teacherData' => $teacherData,
            'studentData' => $studentData,
            'stats' => $stats,
            'isAdmin' => $isAdmin,
            'userRole' => $role,
            'userName' => $user->name,
        ]);
    }
}
