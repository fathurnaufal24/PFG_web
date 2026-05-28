<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentMeetingController extends Controller
{
    //
    public function index() {
        return Inertia::render('ParentMeeting/Index');
    }
}
