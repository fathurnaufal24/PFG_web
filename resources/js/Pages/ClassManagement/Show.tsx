import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    DoorClosed,
    DoorOpen,
    ExternalLink,
    FileUp,
    Plus,
    Save,
    Video,
    X,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

type AttendanceStatus = 'hadir' | 'sakit' | 'izin' | 'tidak_hadir' | 'belum';
type PmStatus = 'belum' | 'terlaksana' | 'lanjut';
type StageKey = 'lesson_plan' | 'active' | 'report' | 'parent_meeting';

interface Student {
    id: number;
    name: string;
}

interface SessionItem {
    id: number;
    label: string;
    datetime: string;
}

interface LessonPlanData {
    [key: string]: any;
    cdev: string[];
    model: string;
    method: string;
    purpose: string;
    output: string;
    outcome: string;
}

interface ClassRoomData {
    id: string;
    title: string;
    subject: string;
    teacher_name: string;
    schedule: string;
    level: number;
    type: string;
    class_link: string;
    room_name: string;
    status: StageKey | 'ended';
    status_raw: string;
    main_alias: string;
    lesson_plan: LessonPlanData | null;
    students: Student[];
    sessions: SessionItem[];
    attendance: Record<number, AttendanceStatus[]>;
    session_history: {
        id: number;
        room_name: string;
        start: string;
        end: string;
        recording: string;
    }[];
    reports: {
        student_id: number;
        student_name: string;
        file_name: string | null;
    }[];
    parent_meetings: {
        id: number;
        student_id: number;
        student_name: string;
        date: string;
        review: string;
        status: PmStatus;
    }[];
}

interface Props {
    classData: ClassRoomData;
    canEdit: boolean;
    userRole?: string;
}

const cdevOptions = [
    { value: 'c1', label: 'C1-Remember' },
    { value: 'c2', label: 'C2-Understanding' },
    { value: 'c3', label: 'C3-Apply' },
    { value: 'c4', label: 'C4-Analyze' },
    { value: 'c5', label: 'C5-Evaluate' },
    { value: 'c6', label: 'C6-Create' },
];

const attendanceOptions: { value: AttendanceStatus; label: string }[] = [
    { value: 'hadir', label: 'Hadir' },
    { value: 'sakit', label: 'Sakit' },
    { value: 'izin', label: 'Izin' },
    { value: 'tidak_hadir', label: 'Tidak Hadir' },
    { value: 'belum', label: 'Belum Absen' },
];

const getTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
        case 'trial':
            return 'bg-purple-100 text-purple-700';
        case 'regular':
            return 'bg-blue-100 text-blue-700';
        case 'private':
            return 'bg-amber-100 text-amber-700';
        default:
            return 'bg-slate-100 text-slate-600';
    }
};

const attendanceStyle = (status: AttendanceStatus) => {
    switch (status) {
        case 'hadir':
            return 'bg-emerald-100 text-emerald-700';
        case 'sakit':
            return 'bg-sky-100 text-sky-700';
        case 'izin':
            return 'bg-amber-100 text-amber-700';
        case 'tidak_hadir':
            return 'bg-rose-100 text-rose-700';
        default:
            return 'bg-slate-100 text-slate-500';
    }
};

const pmStatusLabel = (status: PmStatus) => {
    if (status === 'terlaksana') return 'Hadir';
    if (status === 'lanjut') return 'Lanjut';
    return 'Belum PM';
};

export default function ClassManagementShow({ classData, userRole }: Props) {
    const defaultStage: StageKey =
        classData.status === 'ended' ? 'parent_meeting' : classData.status;

    const [openStage, setOpenStage] = useState<StageKey | null>(defaultStage);
    const [roomOpen, setRoomOpen] = useState(false);
    const [classEnded, setClassEnded] = useState(classData.status === 'ended');
    const [students, setStudents] = useState(classData.students);
    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus[]>>(classData.attendance);
    const [sessionHistory] = useState(classData.session_history);
    const [reports, setReports] = useState(classData.reports);
    const [parentMeetings, setParentMeetings] = useState(classData.parent_meetings);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [newStudentName, setNewStudentName] = useState('');
    const [isLessonSubmitting, setIsLessonSubmitting] = useState(false);
    const [lessonPlan, setLessonPlan] = useState<LessonPlanData>(
        classData.lesson_plan ?? {
            cdev: [],
            model: '',
            method: '',
            purpose: '',
            output: '',
            outcome: '',
        },
    );

    const isTeacher = userRole === 'teacher';

    const toggleStage = (stage: StageKey) => {
        setOpenStage((current) => (current === stage ? null : stage));
    };

    const toggleCdev = (value: string) => {
        setLessonPlan((prev) => ({
            ...prev,
            cdev: prev.cdev.includes(value)
                ? prev.cdev.filter((item) => item !== value)
                : [...prev.cdev, value],
        }));
    };

    const handleLessonPlanSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (lessonPlan.cdev.length === 0) {
            alert('Pilih minimal satu Cognitive Development.');
            return;
        }

        if (!isTeacher) {
            alert('Data dummy tersimpan di layar. Login sebagai teacher untuk simpan ke server.');
            setOpenStage('active');
            return;
        }

        setIsLessonSubmitting(true);
        router.post(`/classmanagement/${classData.id}/lesson-plan`, lessonPlan, {
            onFinish: () => setIsLessonSubmitting(false),
            onSuccess: () => setOpenStage('active'),
            onError: () => alert('Gagal menyimpan lesson plan. Coba cek inputnya.'),
        });
    };

    const updateAttendance = (studentId: number, sessionIndex: number, value: AttendanceStatus) => {
        setAttendance((prev) => {
            const current = [...(prev[studentId] ?? classData.sessions.map(() => 'belum' as AttendanceStatus))];
            current[sessionIndex] = value;
            return { ...prev, [studentId]: current };
        });
    };

    const addStudent = (e: FormEvent) => {
        e.preventDefault();
        const name = newStudentName.trim();
        if (!name) return;

        const id = Date.now();
        setStudents((prev) => [...prev, { id, name }]);
        setAttendance((prev) => ({
            ...prev,
            [id]: classData.sessions.map(() => 'belum' as AttendanceStatus),
        }));
        setReports((prev) => [...prev, { student_id: id, student_name: name, file_name: null }]);
        setParentMeetings((prev) => [
            ...prev,
            {
                id,
                student_id: id,
                student_name: name,
                date: '-',
                review: '-',
                status: 'belum',
            },
        ]);
        setNewStudentName('');
        setIsAddStudentOpen(false);
    };

    const attachReport = (studentId: number, fileName: string) => {
        setReports((prev) =>
            prev.map((item) => (item.student_id === studentId ? { ...item, file_name: fileName } : item)),
        );
    };

    const createParentMeeting = (studentId: number) => {
        setParentMeetings((prev) =>
            prev.map((item) =>
                item.student_id === studentId
                    ? {
                          ...item,
                          date: '16 Maret 2026 (14.33 WIB)',
                          status: 'terlaksana',
                          review: item.review === '-' ? 'Menunggu catatan orang tua' : item.review,
                      }
                    : item,
            ),
        );
    };

    const pendingPmCount = useMemo(
        () => parentMeetings.filter((item) => item.status === 'belum').length,
        [parentMeetings],
    );

    const stages: { key: StageKey; title: string; subtitle: string }[] = [
        { key: 'lesson_plan', title: 'Start Lesson Plan', subtitle: 'Rencana pembelajaran sebelum kelas aktif' },
        { key: 'active', title: 'Start Active Class', subtitle: 'Absensi, room, dan session history' },
        { key: 'report', title: 'Start Report', subtitle: 'Upload laporan per siswa' },
        { key: 'parent_meeting', title: 'Start Parent Meeting', subtitle: 'Lanjut, Belum PM, atau Class Ends' },
    ];

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                <Link
                    href="/classmanagement"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={16} /> Kembali ke Class Overview
                </Link>

                <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Class Room</p>
                            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{classData.title}</h1>
                            <p className="mt-1 text-sm text-slate-500">Main Alias: {classData.main_alias}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getTypeBadgeClass(classData.type)}`}>
                                {classData.type}
                            </span>
                            {classEnded && (
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white">
                                    Class Ended
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <InfoCard label="Teacher" value={classData.teacher_name} />
                        <InfoCard label="Release Schedule" value={classData.schedule} />
                        <InfoCard label="Level" value={String(classData.level)} />
                        <InfoCard
                            label="Class Link"
                            value={classData.class_link}
                            action={
                                <a
                                    href={classData.class_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"
                                >
                                    Buka <ExternalLink size={12} />
                                </a>
                            }
                        />
                    </div>

                    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Class Room</p>
                            <p className="mt-1 text-lg font-bold text-slate-800">
                                {roomOpen ? classData.room_name : '-'}
                            </p>
                            <p className="text-xs text-slate-500">
                                {roomOpen ? 'Room sedang dibuka untuk sesi kelas' : 'Room masih tertutup'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setRoomOpen((open) => !open)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition ${
                                roomOpen
                                    ? 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600'
                                    : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600'
                            }`}
                        >
                            {roomOpen ? <DoorClosed size={16} /> : <DoorOpen size={16} />}
                            {roomOpen ? 'Close Room' : 'Open Room'}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {stages.map((stage) => {
                        const isOpen = openStage === stage.key;
                        return (
                            <section
                                key={stage.key}
                                className={`overflow-hidden rounded-[28px] border bg-white transition-all duration-300 ${
                                    isOpen
                                        ? 'border-emerald-200/90 shadow-[0_16px_36px_rgba(16,185,129,0.08)]'
                                        : 'border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)] hover:border-slate-300'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleStage(stage.key)}
                                    className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-slate-50/70 md:px-6"
                                >
                                    <div>
                                        <h2 className={`text-lg font-bold transition-colors duration-200 ${isOpen ? 'text-emerald-700' : 'text-slate-900 group-hover:text-emerald-600'}`}>
                                            {stage.title}
                                        </h2>
                                        <p className="text-sm text-slate-500">{stage.subtitle}</p>
                                    </div>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'}`}>
                                        <ChevronDown
                                            size={18}
                                            className={`transition-transform duration-300 ease-in-out ${
                                                isOpen ? 'rotate-180 text-emerald-600' : ''
                                            }`}
                                        />
                                    </div>
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        isOpen
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                    }`}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <div className="border-t border-slate-100 px-5 py-5 md:px-6">
                                        {stage.key === 'lesson_plan' && (
                                            <form onSubmit={handleLessonPlanSubmit} className="space-y-5">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                                        Cognitive Development
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {cdevOptions.map((option) => (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                onClick={() => toggleCdev(option.value)}
                                                                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                                                    lessonPlan.cdev.includes(option.value)
                                                                        ? 'bg-emerald-500 text-white shadow-md'
                                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                }`}
                                                            >
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <Field
                                                        label="Learning Model"
                                                        value={lessonPlan.model}
                                                        onChange={(value) => setLessonPlan((prev) => ({ ...prev, model: value }))}
                                                        placeholder="Cooperative Learning"
                                                    />
                                                    <Field
                                                        label="Learning Method"
                                                        value={lessonPlan.method}
                                                        onChange={(value) => setLessonPlan((prev) => ({ ...prev, method: value }))}
                                                        placeholder="Discussion, Demonstration"
                                                    />
                                                </div>

                                                <TextAreaField
                                                    label="Learning Purpose"
                                                    value={lessonPlan.purpose}
                                                    onChange={(value) => setLessonPlan((prev) => ({ ...prev, purpose: value }))}
                                                />
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <TextAreaField
                                                        label="Output Plan"
                                                        value={lessonPlan.output}
                                                        onChange={(value) => setLessonPlan((prev) => ({ ...prev, output: value }))}
                                                    />
                                                    <TextAreaField
                                                        label="Outcome Plan"
                                                        value={lessonPlan.outcome}
                                                        onChange={(value) => setLessonPlan((prev) => ({ ...prev, outcome: value }))}
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenStage('active')}
                                                        className="rounded-xl border border-slate-300 px-6 py-2 text-slate-700 hover:bg-slate-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isLessonSubmitting}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
                                                    >
                                                        <Save size={16} />
                                                        {isLessonSubmitting ? 'Saving...' : 'Simpan'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {stage.key === 'active' && (
                                            <div className="space-y-8">
                                                <div>
                                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <h3 className="text-base font-bold text-slate-800">Attendance</h3>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsAddStudentOpen(true)}
                                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                                                        >
                                                            <Plus size={16} /> Add Student
                                                        </button>
                                                    </div>
                                                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                                        <table className="w-full min-w-[720px] text-left">
                                                            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                                                <tr>
                                                                    <th className="p-4 min-w-[180px] whitespace-nowrap">Name</th>
                                                                    {classData.sessions.length === 0 ? (
                                                                        <th className="p-4 text-xs font-normal normal-case tracking-normal text-slate-400 italic">
                                                                            Belum ada sesi yang dijadwalkan
                                                                        </th>
                                                                    ) : (
                                                                        classData.sessions.map((session) => (
                                                                            <th key={session.id} className="p-4 min-w-[150px] whitespace-nowrap">
                                                                                <p className="whitespace-nowrap">{session.label}</p>
                                                                                <p className="mt-1 text-[10px] font-medium normal-case tracking-normal text-slate-400 whitespace-nowrap">
                                                                                    {session.datetime}
                                                                                </p>
                                                                            </th>
                                                                        ))
                                                                    )}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {students.map((student) => (
                                                                    <tr key={student.id} className="border-t border-slate-100">
                                                                        <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">{student.name}</td>
                                                                        {classData.sessions.length === 0 ? (
                                                                            <td className="p-4 text-xs text-slate-400 italic">
                                                                                Belum ada sesi
                                                                            </td>
                                                                        ) : (
                                                                            classData.sessions.map((session, sessionIndex) => {
                                                                                const value = attendance[student.id]?.[sessionIndex] ?? 'belum';
                                                                                return (
                                                                                    <td key={`${student.id}-${session.id}`} className="p-4 min-w-[150px]">
                                                                                        <select
                                                                                            value={value}
                                                                                            onChange={(e) =>
                                                                                                updateAttendance(
                                                                                                    student.id,
                                                                                                    sessionIndex,
                                                                                                    e.target.value as AttendanceStatus,
                                                                                                )
                                                                                            }
                                                                                            className={`w-full rounded-xl border-0 px-3 py-2 text-xs font-semibold ${attendanceStyle(value)}`}
                                                                                        >
                                                                                            {attendanceOptions.map((option) => (
                                                                                                <option key={option.value} value={option.value}>
                                                                                                    {option.label}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                );
                                                                            })
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="mb-4 text-base font-bold text-slate-800">Session History</h3>
                                                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                                        <table className="w-full min-w-[720px] text-left">
                                                            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                                                <tr>
                                                                    <th className="p-4">Room Name</th>
                                                                    <th className="p-4">Start Session</th>
                                                                    <th className="p-4">End Session</th>
                                                                    <th className="p-4">Recording</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {sessionHistory.map((item) => (
                                                                    <tr key={item.id} className="border-t border-slate-100 text-sm text-slate-700">
                                                                        <td className="p-4 font-semibold">{item.room_name}</td>
                                                                        <td className="p-4">{item.start}</td>
                                                                        <td className="p-4">{item.end}</td>
                                                                        <td className="p-4">
                                                                            <a
                                                                                href={item.recording}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline"
                                                                            >
                                                                                <Video size={14} /> Youtube
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {stage.key === 'report' && (
                                            <div className="space-y-4">
                                                {reports.map((report) => (
                                                    <div
                                                        key={report.student_id}
                                                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                    >
                                                        <div>
                                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                                Students Name
                                                            </p>
                                                            <p className="mt-1 font-semibold text-slate-800">{report.student_name}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {report.file_name ? `File: ${report.file_name}` : 'Belum ada file report'}
                                                            </p>
                                                        </div>
                                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
                                                            <FileUp size={16} /> Upload Report
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) attachReport(report.student_id, file.name);
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                ))}
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        className="rounded-xl border border-slate-300 px-6 py-2 text-slate-700 hover:bg-slate-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenStage('parent_meeting')}
                                                        className="rounded-xl bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-600"
                                                    >
                                                        Simpan
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {stage.key === 'parent_meeting' && (
                                            <div className="space-y-5">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                        PM Belum Terlaksana: {pendingPmCount}
                                                    </span>
                                                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                                        Lanjut
                                                    </span>
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                        Belum PM
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    {parentMeetings.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                                        >
                                                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                                <div>
                                                                    <p className="font-semibold text-slate-800">{item.student_name}</p>
                                                                    <p className="mt-1 text-sm text-slate-500">Date: {item.date}</p>
                                                                    <p className="text-sm text-slate-500">Parent Review: {item.review}</p>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                                                        {pmStatusLabel(item.status)}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => createParentMeeting(item.student_id)}
                                                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
                                                                    >
                                                                        <Plus size={14} /> Create PM
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-between">
                                                    <p className="text-sm text-slate-500">Student Continuation Report</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setClassEnded(true)}
                                                        className="rounded-xl bg-slate-900 px-6 py-2 font-bold text-white hover:bg-slate-800"
                                                    >
                                                        Class Ends
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            {isAddStudentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800">Add Student</h2>
                            <button type="button" onClick={() => setIsAddStudentOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={addStudent} className="space-y-4 p-6">
                            <Field
                                label="Student Name"
                                value={newStudentName}
                                onChange={setNewStudentName}
                                placeholder="Nama siswa"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddStudentOpen(false)}
                                    className="rounded-xl border border-slate-300 px-5 py-2 text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-white">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function InfoCard({
    label,
    value,
    action,
}: {
    label: string;
    value: string;
    action?: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-800">{value}</p>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
    );
}

function TextAreaField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
    );
}
