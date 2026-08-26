<?php

namespace App\Http\Controllers;

use App\Models\ClassOffering;
use App\Models\ClassOfferingTeacher;
use App\Models\ClassManagement;
use App\Models\Course;
use App\Models\Notification;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ClassOfferingController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isAdmin = $user->role === 'admin';
        $teacherId = $user->teacher?->id;

        $this->autoArchiveOfferings();

        $query = ClassOffering::with(['course', 'teacherApplications.teacher.user']);

        if ($isAdmin) {
            $offerings = $query->orderBy('created_at', 'desc')->get();
        } else {
            $offerings = $query->where('is_archived', false)
                ->where(function ($q) {
                    $q->where('close_offering', '>', now())
                        ->orWhereNull('close_offering');
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }

        $mappedOfferings = $offerings->map(function ($offering) use ($isAdmin, $teacherId) {
            $appliedTeachers = $offering->teacherApplications()
                ->where('status', 'pending')
                ->with('teacher.user')
                ->get();

            $acceptedTeacher = $offering->teacherApplications()
                ->where('status', 'accepted')
                ->with('teacher.user')
                ->first();

            $hasApplied = false;
            $applicationStatus = null;
            $selectedPreference = null;

            if (!$isAdmin && $teacherId) {
                $application = $offering->teacherApplications()
                    ->where('teacher_id', $teacherId)
                    ->first();
                if ($application) {
                    $hasApplied = true;
                    $applicationStatus = $application->status;
                    $selectedPreference = $application->selected_preference;
                }
            }

            // Parse preferences
            $preferences = [];
            if ($offering->preferences) {
                foreach ($offering->preferences as $index => $pref) {
                    $preferences[] = [
                        'index' => $index,
                        'day' => $pref['day'] ?? '',
                        'time' => $pref['time'] ?? '',
                        'label' => $pref['day'] . ' ' . $pref['time'],
                    ];
                }
            }

            return [
                'id' => $offering->id,
                'course_id' => $offering->course_id,
                'subject' => $offering->course?->subject ?? 'N/A',
                'level' => $offering->level,
                'period' => $offering->period,
                'order' => $offering->order,
                'type' => $offering->type,
                'student' => $offering->student,
                'schedule_at' => $offering->schedule_at?->format('Y-m-d\TH:i'),
                'schedule_display' => $offering->schedule_at?->format('l, d F Y (H.i WIB)') ?? '-',
                'close_offering' => $offering->close_offering?->format('Y-m-d\TH:i'),
                'close_offering_display' => $offering->close_offering?->format('l, d F Y (H.i WIB)') ?? '-',
                'note' => $offering->note,
                'is_archived' => $offering->is_archived,
                'is_expired' => $offering->close_offering ? $offering->close_offering < now() : false,
                'preferences' => $preferences,
                'applied_teachers' => $appliedTeachers->map(function ($application) {
                    return [
                        'id' => $application->id,
                        'teacher_id' => $application->teacher_id,
                        'teacher_name' => $application->teacher->first_name . ' ' . ($application->teacher->last_name ?? ''),
                        'status' => $application->status,
                        'applied_at' => $application->created_at?->format('d F Y H:i'),
                        'selected_preference' => $application->selected_preference,
                    ];
                }),
                'accepted_teacher' => $acceptedTeacher ? [
                    'id' => $acceptedTeacher->id,
                    'teacher_id' => $acceptedTeacher->teacher_id,
                    'teacher_name' => $acceptedTeacher->teacher->first_name . ' ' . ($acceptedTeacher->teacher->last_name ?? ''),
                    'approved_at' => $acceptedTeacher->approved_at?->format('d F Y H:i'),
                    'selected_preference' => $acceptedTeacher->selected_preference,
                ] : null,
                'has_applied' => $hasApplied,
                'application_status' => $applicationStatus,
                'selected_preference' => $selectedPreference,
                'can_apply' => !$isAdmin
                    && !$hasApplied
                    && !$offering->is_archived
                    && ($offering->close_offering === null || $offering->close_offering > now()),
            ];
        });

        $courses = Course::all(['id', 'subject', 'description']);

        $unreadCount = 0;
        if (!$isAdmin) {
            $unreadCount = Notification::where('user_id', $user->id)
                ->where('read', false)
                ->count();
        }

        return Inertia::render('ClassOffering/Index', [
            'offerings' => $mappedOfferings,
            'courses' => $courses,
            'isAdmin' => $isAdmin,
            'canCreate' => $isAdmin,
            'canEdit' => $isAdmin,
            'canDelete' => $isAdmin,
            'unreadCount' => $unreadCount,
        ]);
    }

    private function autoArchiveOfferings()
    {
        ClassOffering::where('is_archived', false)
            ->where('close_offering', '<', now())
            ->update(['is_archived' => true]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'level' => 'required|integer|min:1',
            'period' => 'required|string',
            'order' => 'required|integer|min:1',
            'type' => 'required|string|in:trial,regular,private',
            'student' => 'nullable|integer|min:0',
            'schedule_at' => 'nullable|date',
            'close_offering' => 'nullable|date|after:now',
            'note' => 'nullable|string',
            'is_archived' => 'boolean',
            'preferences' => 'required|array|min:1',
            'preferences.*.day' => 'required|string',
            'preferences.*.time' => 'required|string',
            'has_deadline' => 'boolean',
        ]);

        // Validasi jika ada deadline
        if ($request->has_deadline && !$validated['close_offering']) {
            return back()->withErrors([
                'close_offering' => 'Please set a deadline date.',
            ]);
        }

        if ($validated['schedule_at'] && $validated['close_offering'] && $validated['close_offering'] >= $validated['schedule_at']) {
            return back()->withErrors([
                'close_offering' => 'Close offering must be before schedule date.',
            ]);
        }

        $validated['curriculum_id'] = auth()->user()->curriculum->id ?? 1;
        $validated['is_archived'] = $validated['is_archived'] ?? false;
        $validated['close_offering'] = $request->has_deadline ? $validated['close_offering'] : null;
        $validated['preferences'] = $validated['preferences'];

        ClassOffering::create($validated);

        return redirect()->route('classoffering')
            ->with('success', 'Class offering created successfully.');
    }

    public function update(Request $request, ClassOffering $classOffering)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'level' => 'required|integer|min:1',
            'period' => 'required|string',
            'order' => 'required|integer|min:1',
            'type' => 'required|string|in:trial,regular,private',
            'student' => 'nullable|integer|min:0',
            'schedule_at' => 'nullable|date',
            'close_offering' => 'nullable|date',
            'note' => 'nullable|string',
            'is_archived' => 'boolean',
            'preferences' => 'required|array|min:1',
            'preferences.*.day' => 'required|string',
            'preferences.*.time' => 'required|string',
            'has_deadline' => 'boolean',
        ]);

        if ($request->has_deadline && !$validated['close_offering']) {
            return back()->withErrors([
                'close_offering' => 'Please set a deadline date.',
            ]);
        }

        if ($validated['schedule_at'] && $validated['close_offering'] && $validated['close_offering'] >= $validated['schedule_at']) {
            return back()->withErrors([
                'close_offering' => 'Close offering must be before schedule date.',
            ]);
        }

        $validated['close_offering'] = $request->has_deadline ? $validated['close_offering'] : null;

        $classOffering->update($validated);

        return redirect()->route('classoffering')
            ->with('success', 'Class offering updated successfully.');
    }

    public function destroy(ClassOffering $classOffering)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $classOffering->teacherApplications()->delete();
        $classOffering->delete();

        return redirect()->route('classoffering')
            ->with('success', 'Class offering deleted successfully.');
    }

    public function apply(Request $request, ClassOffering $classOffering)
    {
        $user = auth()->user();

        if ($user->role !== 'teacher') {
            abort(403);
        }

        $teacherId = $user->teacher?->id;
        if (!$teacherId) {
            return back()->withErrors(['error' => 'Teacher profile not found.']);
        }

        $validated = $request->validate([
            'selected_preference' => 'required|integer|min:0',
        ]);

        // Cek apakah offering masih available
        if ($classOffering->is_archived || $classOffering->close_offering < now()) {
            return back()->withErrors(['error' => 'This offering is no longer available.']);
        }

        // Cek apakah sudah ada teacher yang diterima
        $existingAccepted = $classOffering->teacherApplications()
            ->where('status', 'accepted')
            ->exists();
        if ($existingAccepted) {
            return back()->withErrors(['error' => 'This offering has already been filled.']);
        }

        // Cek apakah teacher sudah apply
        $existingApplication = $classOffering->teacherApplications()
            ->where('teacher_id', $teacherId)
            ->first();
        if ($existingApplication) {
            return back()->withErrors(['error' => 'You have already applied for this offering.']);
        }

        // Create application
        ClassOfferingTeacher::create([
            'class_offering_id' => $classOffering->id,
            'teacher_id' => $teacherId,
            'status' => 'pending',
            'approved_at' => null,
            'selected_preference' => $validated['selected_preference'],
        ]);

        return redirect()->route('classoffering')
            ->with('success', 'Application submitted successfully. Please wait for admin approval.');
    }

    public function approve(Request $request, ClassOffering $classOffering, $applicationId)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $application = ClassOfferingTeacher::where('id', $applicationId)
            ->where('class_offering_id', $classOffering->id)
            ->where('status', 'pending')
            ->firstOrFail();

        // Approve application
        $application->update([
            'status' => 'accepted',
            'approved_at' => now(),
        ]);

        // Reject semua aplikasi lain yang pending untuk offering ini
        $rejectedApplications = ClassOfferingTeacher::where('class_offering_id', $classOffering->id)
            ->where('id', '!=', $applicationId)
            ->where('status', 'pending')
            ->get();

        foreach ($rejectedApplications as $rejected) {
            Notification::create([
                'user_id' => $rejected->teacher->user_id,
                'type' => 'class_offering_rejected',
                'title' => 'Mohon maaf anda belum diterima',
                'text' => "Kami mohon maaf, anda belum diterima untuk offering {$classOffering->course->subject} (Lvl. {$classOffering->level}). Silakan coba offering lainnya.",
                'href' => '/classoffering',
                'read' => false,
            ]);

            $rejected->delete();
        }

        // Kirim notifikasi ke teacher yang diterima
        Notification::create([
            'user_id' => $application->teacher->user_id,
            'type' => 'class_offering_accepted',
            'title' => 'Selamat anda diterima!',
            'text' => "Selamat, anda telah diterima untuk offering {$classOffering->course->subject} (Lvl. {$classOffering->level}). Silakan cek Class Management untuk detailnya.",
            'href' => '/classmanagement',
            'read' => false,
        ]);

        // Create class management dengan preferences yang dipilih teacher
        $preferences = $classOffering->preferences ?? [];
        $selectedPref = $preferences[$application->selected_preference] ?? null;

        $classManagement = ClassManagement::create([
            'course_id' => $classOffering->course_id,
            'teacher_id' => $application->teacher_id,
            'level' => $classOffering->level,
            'period' => $classOffering->period,
            'order' => $classOffering->order,
            'type' => $classOffering->type,
            'student' => $classOffering->student,
            'schedule_at' => $classOffering->schedule_at,
            'note' => $classOffering->note,
            'session' => 0,
            'status' => 'inactive',
            'preferred_day' => $selectedPref['day'] ?? null, // Tambahkan field di migration
            'preferred_time' => $selectedPref['time'] ?? null, // Tambahkan field di migration
        ]);

        // Archive offering
        $classOffering->update(['is_archived' => true]);

        return redirect()->route('classoffering')
            ->with('success', 'Teacher approved successfully. Class Management created.');
    }

    public function reject(Request $request, ClassOffering $classOffering, $applicationId)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $application = ClassOfferingTeacher::where('id', $applicationId)
            ->where('class_offering_id', $classOffering->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $teacher = $application->teacher;

        Notification::create([
            'user_id' => $teacher->user_id,
            'type' => 'class_offering_rejected',
            'title' => 'Mohon maaf anda belum diterima',
            'text' => "Kami mohon maaf, anda belum diterima untuk offering {$classOffering->course->subject} (Lvl. {$classOffering->level}). Silakan coba offering lainnya.",
            'href' => '/classoffering',
            'read' => false,
        ]);

        $application->delete();

        return redirect()->route('classoffering')
            ->with('success', 'Teacher rejected successfully.');
    }
}
