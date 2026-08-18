<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Notification;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $unreadCount = 0;

        // Jika user login dan bukan admin, ambil unread count
        if ($user && $user->role !== 'admin') {
            $unreadCount = Notification::where('user_id', $user->id)
                ->where('read', false)
                ->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'unreadCount' => $unreadCount, // Share ke semua halaman
        ];
    }
}
