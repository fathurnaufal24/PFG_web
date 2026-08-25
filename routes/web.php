<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ClassManagementController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParentMeetingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RevenueController;
use App\Http\Controllers\ClassOfferingController;
use App\Models\ClassManagement;
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


Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/classmanagement', [ClassManagementController::class, 'index'])->name('classmanagement');
    Route::get('/classmanagement/create', [ClassManagementController::class, 'create'])->name('classmanagement.create');
    Route::get('/classmanagement/{classmanagement}', [ClassManagementController::class, 'show'])->name('classmanagement.show');
    Route::get('/classmanagement/{classmanagement}/edit', [ClassManagementController::class, 'edit'])->name('classmanagement.edit');
    Route::post('/classmanagement', [ClassManagementController::class, 'store'])->name('classmanagement.store');
    Route::post('/classmanagement/{classmanagement}/lesson-plan', [ClassManagementController::class, 'storeLessonPlan'])
        ->name('classmanagement.lesson-plan.store');
    Route::put('/classmanagement/{classmanagement}', [ClassManagementController::class, 'update'])->name('classmanagement.update');
    Route::delete('/classmanagement/{classmanagement}', [ClassManagementController::class, 'destroy'])->name('classmanagement.destroy');
    Route::post('/classmanagement/{classmanagement}/set-time', [ClassManagementController::class, 'setTime'])
        ->name('classmanagement.set-time');
    Route::get('/classmanagement/{classmanagement}/schedule', [ClassManagementController::class, 'getSchedule'])
        ->name('classmanagement.schedule');
    Route::get('/classmanagement/{classmanagement}/can-start-lesson', [ClassManagementController::class, 'canStartLessonPlan'])
        ->name('classmanagement.can-start-lesson');
    Route::get('/revenue', [RevenueController::class, 'index'])->name('revenue');
    Route::get('/schedule', function () {
        return Inertia::render('Schedule/Index');
    })->name('schedule');
    Route::get('/module', [ModuleController::class, 'index'])->name('module');
    Route::get('/classoffering', [ClassOfferingController::class, 'index'])->name('classoffering');
    Route::post('/classoffering', [ClassOfferingController::class, 'store'])->name('classoffering.store');
    Route::put('/classoffering/{classOffering}', [ClassOfferingController::class, 'update'])->name('classoffering.update');
    Route::delete('/classoffering/{classOffering}', [ClassOfferingController::class, 'destroy'])->name('classoffering.destroy');
    Route::post('/classoffering/{classOffering}/apply', [ClassOfferingController::class, 'apply'])->name('classoffering.apply');
    Route::post('/classoffering/{classOffering}/approve/{applicationId}', [ClassOfferingController::class, 'approve'])->name('classoffering.approve');
    Route::post('/classoffering/{classOffering}/reject/{applicationId}', [ClassOfferingController::class, 'reject'])->name('classoffering.reject');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
    Route::get('/parentmeeting', [ParentMeetingController::class, 'index'])->name('parentmeeting');
});

require __DIR__ . '/auth.php';
