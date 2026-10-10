<?php

namespace App\Http\Controllers;

use App\Models\ClassTypeSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $this->authorizeAdmin();

        $settings = collect(ClassTypeSetting::TYPES)->map(fn ($type) => [
            'type' => $type,
            'max_student' => ClassTypeSetting::maxStudentFor($type),
        ]);

        return Inertia::render('Setting/Index', [
            'classTypes' => $settings,
        ]);
    }

    public function updateClassTypes(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.type' => 'required|string|in:' . implode(',', ClassTypeSetting::TYPES),
            'settings.*.max_student' => 'required|integer|min:1|max:100',
        ]);

        foreach ($validated['settings'] as $setting) {
            ClassTypeSetting::updateOrCreate(
                ['type' => $setting['type']],
                ['max_student' => $setting['max_student']]
            );
        }

        return back()->with('success', 'Settings saved. New classes will use these limits.');
    }

    private function authorizeAdmin(): void
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }
    }
}
