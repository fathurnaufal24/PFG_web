<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $user->load('teacher');

        $role = $user->role;
        $teacherData = null;
        $isAdmin = false;

        if ($role === 'admin') {
            $isAdmin = true;
            $teacherData = null;
        } else if ($role === 'teacher') {
            $teacherData = $user->teacher;
        }
        return Inertia::render('Dashboard', [
            'teacherData' => $teacherData,
            'isAdmin' => $isAdmin,
            'userRole' => $role,
            'userName' => $user->name,
        ]);
    }
}
