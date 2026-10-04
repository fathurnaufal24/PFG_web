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
            $subjectCode = trim(sprintf('%s – %s.%s', $subject, $class->period, $class->order));
            if (strtolower((string) $class->type) === 'trial') {
                $subjectCode .= ' – P1';
            }

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
                'subject' => $subjectCode,
                'subject_name' => $subject,
                'level' => $class->level ?? 0,
                'type' => $class->type ?? '-',
                'period' => $class->period ?? '',
                'order' => $class->order ?? 1,
                'session' => ($class->schedules && $class->schedules->isNotEmpty()) ? $class->schedules->count() : ($class->session ?? 0),
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
            'canCreate' => $user->role === 'admin' || ($user->role === 'teacher' && (bool) $user->teacher),
            'canEdit' => $user->role === 'admin',
            'courses' => $courses,
            'userRole' => $user->role,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'admin' && (!$user->teacher || $user->role !== 'teacher')) {
            abort(403);
        }

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'type' => 'required|string|in:trial,regular,private',
            'level' => 'required|integer|min:1',
            'period' => 'required|string|max:50',
            'order' => 'nullable|integer|min:1',
            'schedule_at' => 'nullable|date',
            'note' => 'nullable|string',
            'teacher_id' => 'nullable|exists:teachers,id',
            'session' => 'nullable|integer|min:0',
            'student' => 'nullable|integer|min:0',
        ]);

        $validated['status'] = 'inactive';
        $validated['order'] = $validated['order'] ?? 1;
        $validated['session'] = $validated['session'] ?? 0;
        $validated['student'] = $validated['student'] ?? 0;
        $validated['teacher_id'] = $user->role === 'teacher'
            ? $user->teacher->id
            : ($validated['teacher_id'] ?? null);
        $validated['note'] = $validated['note'] ?? '';

        ClassManagement::create($validated);

        return redirect()->route('classmanagement')
            ->with('success', 'Class created successfully');
    }

    public function create()
    {
        $user = auth()->user();

        if ($user->role !== 'admin' && (!$user->teacher || $user->role !== 'teacher')) {
            abort(403);
        }

        return $this->index();
    }

    public function edit(ClassManagement $classmanagement)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        return $this->show($classmanagement);
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

        $classmanagement->load(['course', 'teacher.user', 'lessonPlan', 'schedules']);

        return Inertia::render('ClassManagement/Show', [
            'classData' => $this->classroomPayload($classmanagement),
            'canEdit' => $user->role === 'admin',
            'userRole' => $user->role,
        ]);
    }

    /**
     * Dummy classroom payload for Teacher Portal slides 7-12.
     * Real persistence can replace these arrays later.
     */
    private function classroomPayload(ClassManagement $class): array
    {
        $subject = $class->course?->subject ?? 'N/A';
        $title = trim(sprintf('%s – %s.%s', $subject, $class->period, $class->order));
        if (strtolower((string) $class->type) === 'trial') {
            $title .= ' – P1';
        }

        $schedule = '-';
        if ($class->schedule_at) {
            try {
                $schedule = $class->schedule_at->locale('id')->translatedFormat('l, d F Y - H.i') . ' WIB';
            } catch (\Exception $e) {
                $schedule = $class->schedule_at->format('l, d F Y - H.i') . ' WIB';
            }
        }

        $teacherName = $class->teacher
            ? trim($class->teacher->first_name . ' ' . ($class->teacher->last_name ?? ''))
            : 'Not Assigned';

        $statusMap = [
            'inactive' => 'lesson_plan',
            'active' => 'active',
            'report' => 'report',
            'pm' => 'parent_meeting',
            'ended' => 'ended',
        ];

        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title) ?: 'class');

        $lessonPlan = null;
        if ($class->lessonPlan) {
            $cdev = $class->lessonPlan->cdev;
            if (is_string($cdev)) {
                $cdev = json_decode($cdev, true) ?: [];
            }

            $lessonPlan = [
                'cdev' => $cdev,
                'model' => $class->lessonPlan->model,
                'method' => $class->lessonPlan->method,
                'purpose' => $class->lessonPlan->purpose,
                'output' => $class->lessonPlan->output,
                'outcome' => $class->lessonPlan->outcome,
            ];
        }

        // Dynamically build sessions from class schedules (or session count)
        $sessions = [];
        if ($class->schedules && $class->schedules->isNotEmpty()) {
            $sessions = $class->schedules
                ->sortBy('meeting_number')
                ->values()
                ->map(function ($sch) {
                    $datetime = '-';
                    if ($sch->schedule_at) {
                        try {
                            $datetime = $sch->schedule_at->locale('id')->translatedFormat('d M Y (H.i \W\I\B)');
                        } catch (\Exception $e) {
                            $datetime = $sch->schedule_at->format('d M Y (H.i \W\I\B)');
                        }
                    }

                    return [
                        'id' => (int) $sch->meeting_number,
                        'label' => 'Session ' . $sch->meeting_number,
                        'datetime' => $datetime,
                    ];
                })
                ->toArray();
        } elseif (($class->session ?? 0) > 0) {
            $startDate = $class->schedule_at ? \Carbon\Carbon::parse($class->schedule_at) : null;
            for ($i = 1; $i <= (int) $class->session; $i++) {
                $datetime = '-';
                if ($startDate) {
                    try {
                        $meetingDate = $startDate->copy()->addWeeks($i - 1);
                        $datetime = $meetingDate->locale('id')->translatedFormat('d M Y (H.i \W\I\B)');
                    } catch (\Exception $e) {
                        $datetime = '-';
                    }
                }

                $sessions[] = [
                    'id' => $i,
                    'label' => 'Session ' . $i,
                    'datetime' => $datetime,
                ];
            }
        }

        $sessionCount = count($sessions);
        $attendance = [
            1 => [],
            2 => [],
        ];
        for ($i = 0; $i < $sessionCount; $i++) {
            $attendance[1][] = $i === 0 ? 'hadir' : ($i === 1 ? 'sakit' : 'belum');
            $attendance[2][] = $i === 0 ? 'izin' : ($i === 1 ? 'tidak_hadir' : 'belum');
        }

        $sessionHistory = [];
        $pastSchedules = $class->schedules ? $class->schedules->sortBy('meeting_number')->values() : collect();
        if ($pastSchedules->isNotEmpty()) {
            $countToTake = min(2, $pastSchedules->count());
            for ($i = 0; $i < $countToTake; $i++) {
                $sch = $pastSchedules[$i];
                $startStr = $sch->schedule_at
                    ? $sch->schedule_at->locale('id')->translatedFormat('d F Y – H.i') . ' WIB'
                    : '13 Februari 2026 – 19.01 WIB';
                $endStr = $sch->schedule_at
                    ? $sch->schedule_at->copy()->addMinutes(70)->locale('id')->translatedFormat('d F Y – H.i') . ' WIB'
                    : '13 Februari 2026 – 20.11 WIB';

                $sessionHistory[] = [
                    'id' => $sch->meeting_number,
                    'room_name' => 'PFG-' . str_pad((string) ($class->id * 10 + $i), 2, '0', STR_PAD_LEFT),
                    'start' => $startStr,
                    'end' => $endStr,
                    'recording' => 'https://youtube.com',
                ];
            }
        } else {
            $sessionHistory = [
                [
                    'id' => 1,
                    'room_name' => 'PFG-10',
                    'start' => '13 Februari 2026 – 19.01 WIB',
                    'end' => '13 Februari 2026 – 20.11 WIB',
                    'recording' => 'https://youtube.com',
                ],
                [
                    'id' => 2,
                    'room_name' => 'PFG-42',
                    'start' => '20 Februari 2026 – 18.47 WIB',
                    'end' => '20 Februari 2026 – 20.00 WIB',
                    'recording' => 'https://youtube.com',
                ],
            ];
        }

        return [
            'id' => $class->id,
            'title' => $title,
            'subject' => $subject,
            'teacher_name' => $teacherName,
            'schedule' => $schedule,
            'level' => $class->level ?? 1,
            'type' => $class->type ?? 'regular',
            'class_link' => 'https://meet.pfg.id/' . trim($slug, '-'),
            'room_name' => 'PFG-' . str_pad((string) $class->id, 2, '0', STR_PAD_LEFT),
            'status' => $statusMap[$class->status] ?? 'lesson_plan',
            'status_raw' => $class->status,
            'main_alias' => $title,
            'lesson_plan' => $lessonPlan,
            'students' => [
                ['id' => 1, 'name' => 'Muhammad Al-Fatih'],
                ['id' => 2, 'name' => 'Reza Alfian'],
            ],
            'sessions' => $sessions,
            'attendance' => $attendance,
            'session_history' => $sessionHistory,
            'reports' => [
                ['student_id' => 1, 'student_name' => 'Muhammad Al-Fatih', 'file_name' => null],
                ['student_id' => 2, 'student_name' => 'Reza Alfian', 'file_name' => null],
            ],
            'parent_meetings' => [
                [
                    'id' => 1,
                    'student_id' => 1,
                    'student_name' => 'Muhammad Al-Fatih',
                    'date' => '16 Maret 2026 (14.33 WIB)',
                    'review' => '-',
                    'status' => 'belum',
                ],
                [
                    'id' => 2,
                    'student_id' => 2,
                    'student_name' => 'Reza Alfian',
                    'date' => '16 Maret 2026 (14.33 WIB)',
                    'review' => '-',
                    'status' => 'belum',
                ],
            ],
        ];
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
            'level' => 'required|integer|min:1',
            'period' => 'required|string|max:50',
            'order' => 'required|integer|min:1',
            'type' => 'required|string|in:trial,regular,private',
            'session' => 'nullable|integer|min:0',
            'student' => 'nullable|integer|min:0',
            'schedule_at' => 'nullable|date',
            'note' => 'nullable|string',
        ]);

        $validated['note'] = $validated['note'] ?? '';
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

        if ($classmanagement->lessonPlan()->exists()) {
            return back()->withErrors(['error' => 'This class already has a lesson plan.']);
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

        // Update class management schedule_at (first meeting) and total session
        $classmanagement->update([
            'schedule_at' => $schedules[0]['schedule_at'],
            'session' => $meetingCount,
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
