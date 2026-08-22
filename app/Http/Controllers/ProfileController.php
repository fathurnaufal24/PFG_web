<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Load relasi user berdasarkan role
        $user = $request->user();
        
        // Load relasi yang sesuai
        if ($user->role === 'teacher') {
            $user->load('teacher');
        } elseif ($user->role === 'admin') {
            $user->load('curriculum');
        } elseif ($user->role === 'student') {
            $user->load('student');
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $user, // Kirim user dengan relasi yang sudah di-load
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Update email jika berubah
        if ($request->email !== $user->email) {
            $user->update([
                'email' => $request->email
            ]);
        }

        $requestData = $request->only([
            'first_name',
            'last_name',
            'dob',
            'pob',
            'domicile',
            'card_number'
        ]);

        // Update berdasarkan role
        if ($user->role === 'teacher' && $user->teacher) {
            $user->teacher()->update($requestData);
        } else if ($user->role === 'admin' && $user->curriculum) {
            $user->curriculum()->update([
                'name' => $request->name
            ]);
        } else if ($user->role === 'student' && $user->student) {
            $user->student()->update([
                'name' => $request->name
            ]);
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}