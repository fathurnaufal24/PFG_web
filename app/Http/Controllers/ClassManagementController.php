<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassManagementController extends Controller
{
    public function index() {
        // $user = auth()->user();
        // if ($user->role === 'admin') {
        //     $course = Course::with('teacher.user')->get();
        // }
        // else {
        //     $course = $user->teacher->course;
        // }
        return Inertia::render('Course/CourseDashboard', [
            // 'canCreate' => auth()->user()->can('create', Course::class),
            // 'courses' => $course,
            // 'canCreate' => $user->role === 'admin'
        ]);
    }
}
