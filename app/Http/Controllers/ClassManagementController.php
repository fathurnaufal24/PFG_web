<?php

namespace App\Http\Controllers;

use App\Models\ClassManagement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassManagementController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Query dasar
        $query = ClassManagement::with(['course', 'teacher.user']);

        // Jika bukan admin, filter hanya data yang dimiliki teacher tersebut
        if ($user->role !== 'admin') {
            // Pastikan user memiliki relasi teacher
            if ($user->teacher) {
                $query->where('teacher_id', $user->teacher->id);
            } else {
                // Jika teacher tidak memiliki relasi teacher (shouldn't happen), return empty
                $query->whereRaw('1 = 0'); // Tidak mengembalikan data apapun
            }
        }
        // Jika admin, tidak ada filter (bisa lihat semua)

        $classManagements = $query->get()->map(function ($class) {
            $subject = $class->course ? $class->course->subject : 'N/A';
            $levelType = $class->level . ' ' . ucfirst($class->type);
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
                'subject' => $subject,
                'level' => $class->level,
                'level_type' => $levelType,
                'session' => $class->session ?? 0,
                'schedule' => $schedule,
                'students' => $class->student ?? 0,
                'students_text' => ($class->student ?? 0) . ' Student' . (($class->student ?? 0) > 1 ? 's' : ''),
                'status' => $statusMap[$class->status] ?? $class->status,
                'status_raw' => $class->status,
                'teacher_name' => $class->teacher ?
                    $class->teacher->first_name . ' ' . ($class->teacher->last_name ?? '') :
                    'Not Assigned',
                'note' => $class->note,
            ];
        });

        // Hitung status counts berdasarkan data yang sudah difilter
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

        return Inertia::render('ClassManagement/Index', [
            'classes' => $classManagements,
            'tabs' => $tabs,
            'canCreate' => $user->role === 'admin',
            'canEdit' => $user->role === 'admin',
            'userRole' => $user->role, // Kirim role ke frontend (opsional)
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
}
