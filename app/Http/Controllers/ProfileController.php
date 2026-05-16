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
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // dd($request->all());
        $user = $request->user();

        // if ($user->isDirty('email')) {
        //     $user->email_verified_at = null;
        // }
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
        // $request->user()->save();
        if ($user->teacher) {
            $user->teacher()->update($requestData);
        } else if ($user->curriculum) {
            $user->curriculum()->update([
                'name' => $request->name
            ]);
        } else {
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
