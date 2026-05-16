<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RevenueController extends Controller
{
    //
    public function index() {
        return Inertia::render('Revenue/RevenueIndex');
    }
}
