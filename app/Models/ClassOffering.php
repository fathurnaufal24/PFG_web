<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;

class ClassOffering extends Model
{
    /** @use HasFactory<\Database\Factories\ClassOfferingFactory> */
    use HasFactory;

    public function index() {
        return Inertia::render('ClassOffering/Index');
    }
}
