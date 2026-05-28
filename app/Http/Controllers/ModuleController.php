<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    //
    public function index() {
        return Inertia::render("Module/Index");
    }
}
