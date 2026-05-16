<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    use AuthorizesRequests;

    public function index() {
        $user = auth()->user();
        if ($user->role === 'admin') {
            $course = Course::with('teacher.user')->get();
        }
        else {
            $course = $user->teacher->course;
        }
        return Inertia::render('Course/CourseDashboard', [
            // 'canCreate' => auth()->user()->can('create', Course::class),
            'courses' => $course,
            'canCreate' => $user->role === 'admin'
        ]);
    }

    public function show(Course $course) {
        $course->load('teacher');
        if (!$course->teacher) {
            return Inertia::render('Course/SetTeacherId');
        }
        return Inertia::render('Course/CourseShow', [
            'course' => $course
        ]);
    }

    public function store() {
        if (auth()->user()->role !== 'admin') {
            abort(404);
        }
        // dd(request()->all());

        $validation = request()->validate([
            'subject' => ['required', 'string'],
            'level' => ['required', 'numeric'],
            'period' => ['required', 'numeric'],
            'order' => ['required', 'numeric'],
            'type' => ['required', 'string'],
            'schedule_at' => ['required', 'date'],
            'note' => ['string', 'nullable'],
            'teacher_id' => ['nullable']
        ]);
        Course::create($validation);
    }
}
