<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ClassManagementController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParentMeetingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RevenueController;
use App\Models\ClassManagement;
use App\Models\ClassOffering;
use App\Models\Teacher;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Homepage dari web PFG
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Disini aku comment karena route untuk login dan register sudah ada di file auth.php

//Login Page
// Route::get('/login', function () {
//     return Inertia::render('Auth/Login');
// });

//Register Page
// Route::get('/register', [RegisteredUserController::class], 'create');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/classmanagement', [ClassManagementController::class, 'index'])->name('classmanagement');
    Route::get('/classmanagement/{classmanagement}', [ClassManagementController::class, 'show'])->name('classmanagement.show');
    Route::post('/classmanagement', [ClassManagementController::class, 'store'])->name('classmanagement.store');
    Route::get('/revenue', [RevenueController::class, 'index'])->name('revenue');
    Route::get('/schedule', function() {
        return Inertia::render('Schedule/Index');
    })->name('schedule');
    Route::get('/module', [ModuleController::class, 'index'])->name('module');
    Route::get('/classoffering', [ClassOffering::class, 'index'])->name('classoffering');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::get('/parentmeeting', [ParentMeetingController::class, 'index'])->name('parentmeeting');
});

require __DIR__.'/auth.php';
