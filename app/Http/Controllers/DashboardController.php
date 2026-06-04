<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userdata = auth()->user()->load('teacher');
        return Inertia::render('Dashboard', [
        'teacherData' => $userdata->teacher
        ]);
    }
}
