<?php

namespace App\Http\Controllers;

use App\Models\ClassManagement;
use App\Models\ClassSchedule;
use App\Models\Course;
use App\Models\LessonPlan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassManagementController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // LOAD RELASI SCHEDULES
        $query = ClassManagement::with(['course', 'teacher.user', 'schedules']);

        if ($user->role !== 'admin') {
            if ($user->teacher) {
                $query->where('teacher_id', $user->teacher->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $classManagements = $query->get()->map(function ($class) {
            $subject = $class->course ? $class->course->subject : 'N/A';

            // Format schedule
            $schedule = '-';
            if ($class->schedule_at) {
                try {
                    if (is_string($class->schedule_at)) {
                        $class->schedule_at = \Carbon\Carbon::parse($class->schedule_at);
                    }
                    $schedule = $class->schedule_at->format('l, d F Y (H.i WIB)');
                } catch (\Exception $e) {
                    $schedule = '-';
                }
            }

            $statusMap = [
                'inactive' => 'Lesson Plan',
                'active' => 'Active',
                'report' => 'Report',
                'pm' => 'Parent Meeting',
                'ended' => 'Class Ended'
            ];

            return [
                'id' => $class->id,
                'course_id' => $class->course_id,
                'subject' => $subject,
                'level' => $class->level ?? 0,
                'type' => $class->type ?? '-',
                'period' => $class->period ?? '',
                'order' => $class->order ?? 1,
                'session' => $class->session ?? 0,
                'schedule' => $schedule,
                'schedule_at' => $class->schedule_at ? $class->schedule_at->format('Y-m-d\TH:i') : null,
                'students' => $class->student ?? 0,
                'students_text' => ($class->student ?? 0) . ' Student' . (($class->student ?? 0) > 1 ? 's' : ''),
                'status' => $statusMap[$class->status] ?? $class->status,
                'status_raw' => $class->status,
                'teacher_name' => $class->teacher ?
                    $class->teacher->first_name . ' ' . ($class->teacher->last_name ?? '') :
                    'Not Assigned',
                'teacher_id' => $class->teacher_id,
                'note' => $class->note,
                // TAMBAHKAN 3 FIELD INI:
                'preferred_day' => $class->preferred_day,
                'preferred_time' => $class->preferred_time,
                'has_schedule' => $class->schedules->count() > 0,
                'total_meetings' => $class->schedules->count(),
            ];
        });

        $statusCounts = [
            'Lesson Plan' => $classManagements->where('status', 'Lesson Plan')->count(),
            'Active' => $classManagements->where('status', 'Active')->count(),
            'Report' => $classManagements->where('status', 'Report')->count(),
            'Parent Meeting' => $classManagements->where('status', 'Parent Meeting')->count(),
            'Class Ended' => $classManagements->where('status', 'Class Ended')->count()
        ];

        $tabs = collect($statusCounts)->map(function ($count, $name) {
            return [
                'name' => $name,
                'count' => $count
            ];
        })->values()->toArray();

        // Ambil semua courses untuk dropdown
        $courses = \App\Models\Course::all(['id', 'subject', 'description']);

        return Inertia::render('ClassManagement/Index', [
            'classes' => $classManagements,
            'tabs' => $tabs,
            'canCreate' => $user->role === 'admin',
            'canEdit' => $user->role === 'admin',
            'courses' => $courses,
            'userRole' => $user->role,
        ]);
    }

    public function store(Request $request)
    {
        // Hanya admin yang bisa create
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'type' => 'required|string|in:trial,regular,private',
            'level' => 'required|integer',
            'period' => 'required|string', // Ubah jadi string karena period code bisa berupa string
            'order' => 'nullable|integer',
            'schedule_at' => 'nullable|date',
            'note' => 'nullable|string',
            'status' => 'required|string|in:inactive,active,report,pm,ended',
            'teacher_id' => 'nullable|exists:teachers,id',
            'session' => 'nullable|integer',
            'student' => 'nullable|integer',
        ]);

        // Set default values jika tidak ada
        $validated['order'] = $validated['order'] ?? 1;
        $validated['session'] = $validated['session'] ?? 0;
        $validated['student'] = $validated['student'] ?? 0;

        // Jika teacher_id tidak dikirim, set null
        $validated['teacher_id'] = $validated['teacher_id'] ?? null;

        $classManagement = ClassManagement::create($validated);

        return redirect()->route('classmanagement')
            ->with('success', 'Class created successfully');
    }

    public function show(ClassManagement $classmanagement)
    {
        $user = auth()->user();

        // Cek akses: admin bisa lihat semua, teacher hanya bisa lihat miliknya sendiri
        if ($user->role !== 'admin') {
            // Pastikan teacher hanya bisa melihat data miliknya
            if (!$user->teacher || $classmanagement->teacher_id !== $user->teacher->id) {
                abort(403, 'You are not authorized to view this class.');
            }
        }

        $classmanagement->load(['course', 'teacher.user']);

        return Inertia::render('ClassManagement/Show', [
            'class' => $classmanagement,
            'canEdit' => $user->role === 'admin',
        ]);
    }

    public function update(Request $request, ClassManagement $classmanagement)
    {
        // Hanya admin yang bisa update
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'level' => 'required|integer',
            'period' => 'required|integer',
            'order' => 'required|integer',
            'type' => 'required|string|in:trial,regular,private',
            'session' => 'nullable|integer',
            'student' => 'nullable|integer',
            'schedule_at' => 'nullable|date',
            'note' => 'nullable|string',
            'status' => 'required|string|in:inactive,active,report,pm,ended'
        ]);

        $classmanagement->update($validated);

        return redirect()->route('classmanagement')
            ->with('success', 'Class updated successfully');
    }

    public function destroy(ClassManagement $classmanagement)
    {
        // Hanya admin yang bisa delete
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $classmanagement->delete();

        return redirect()->route('classmanagement')
            ->with('success', 'Class deleted successfully');
    }

    /**
     * Store a new lesson plan and update class status to active
     */
    public function storeLessonPlan(Request $request, ClassManagement $classmanagement)
    {
        // Hanya teacher yang bisa membuat lesson plan untuk class miliknya
        $user = auth()->user();
        if ($user->role !== 'teacher') {
            abort(403, 'Only teachers can create lesson plans.');
        }

        // Pastikan teacher ini adalah pengajar di class tersebut
        if (!$user->teacher || $classmanagement->teacher_id !== $user->teacher->id) {
            abort(403, 'You are not assigned to this class.');
        }

        // Pastikan status class masih inactive
        if ($classmanagement->status !== 'inactive') {
            return back()->withErrors(['error' => 'Lesson plan can only be created for inactive classes.']);
        }

        // Validasi input
        $validated = $request->validate([
            'cdev' => 'required|array|min:1',
            'cdev.*' => 'string|in:c1,c2,c3,c4,c5,c6',
            'model' => 'required|string|max:255',
            'method' => 'required|string|max:255',
            'purpose' => 'required|string',
            'output' => 'required|string',
            'outcome' => 'required|string',
        ]);

        // Simpan lesson plan
        $lessonPlan = LessonPlan::create([
            'class_management_id' => $classmanagement->id,
            'cdev' => json_encode($validated['cdev']), // Simpan sebagai JSON
            'model' => $validated['model'],
            'method' => $validated['method'],
            'purpose' => $validated['purpose'],
            'output' => $validated['output'],
            'outcome' => $validated['outcome'],
        ]);

        // Update status class menjadi active
        $classmanagement->update(['status' => 'active']);

        return redirect()->route('classmanagement')
            ->with('success', 'Lesson plan created successfully! Class status updated to Active.');
    }
    /**
     * Set time schedule for a class (Admin only)
     * Generate 10 weekly meetings
     */
    public function setTime(Request $request, ClassManagement $classmanagement)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'start_date' => 'required|date|after:now',
            'start_time' => 'required|date_format:H:i',
            'meeting_count' => 'nullable|integer|min:1|max:20',
            'start_this_week' => 'boolean',
        ]);

        // Hapus schedules lama jika ada
        $classmanagement->schedules()->delete();

        $startDate = Carbon::parse($validated['start_date']);
        $startTime = $validated['start_time'];
        $meetingCount = $validated['meeting_count'] ?? 10;

        // Parse time
        [$hour, $minute] = explode(':', $startTime);

        // Generate schedules
        $schedules = [];
        for ($i = 0; $i < $meetingCount; $i++) {
            $meetingDate = $startDate->copy()->addWeeks($i);
            $meetingDate->setTime($hour, $minute, 0);

            $schedules[] = [
                'class_management_id' => $classmanagement->id,
                'meeting_number' => $i + 1,
                'schedule_at' => $meetingDate,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        ClassSchedule::insert($schedules);

        // Update class management schedule_at (first meeting)
        $classmanagement->update([
            'schedule_at' => $schedules[0]['schedule_at'],
        ]);

        return redirect()->route('classmanagement')
            ->with('success', "{$meetingCount} weekly meeting schedules created successfully!");
    }

    /**
     * Get schedule for a class
     */
    public function getSchedule(ClassManagement $classmanagement)
    {
        $schedules = $classmanagement->schedules()
            ->orderBy('meeting_number')
            ->get();

        return response()->json([
            'schedules' => $schedules,
            'preferred_day' => $classmanagement->preferred_day,
            'preferred_time' => $classmanagement->preferred_time,
        ]);
    }

    /**
     * Check if class can start lesson plan
     */
    public function canStartLessonPlan(ClassManagement $classmanagement)
    {
        $hasSchedule = $classmanagement->schedules()->count() > 0;
        $hasLessonPlan = $classmanagement->lessonPlan()->exists();

        return response()->json([
            'can_start' => $hasSchedule && !$hasLessonPlan,
            'has_schedule' => $hasSchedule,
            'has_lesson_plan' => $hasLessonPlan,
        ]);
    }
}
