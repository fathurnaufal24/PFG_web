<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Notification;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $unreadCount = 0;

        if ($user) {
            // Load relasi berdasarkan role
            if ($user->role === 'teacher') {
                $user->load('teacher');
            } elseif ($user->role === 'admin') {
                $user->load('curriculum');
            } elseif ($user->role === 'student') {
                $user->load('student');
            }

            // Hitung notifikasi unread (kecuali admin)
            if ($user->role !== 'admin') {
                $unreadCount = Notification::where('user_id', $user->id)
                    ->where('read', false)
                    ->count();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'unreadCount' => $unreadCount,
        ];
    }
}