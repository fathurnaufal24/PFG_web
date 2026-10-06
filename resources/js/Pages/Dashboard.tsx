import React from 'react';
import { Star, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, BookOpen, Calendar, Clock, GraduationCap, ArrowRight, CheckCircle2, AlertCircle, Video, Users, Sparkles } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { TeacherProps } from '@/types';
import { Link } from '@inertiajs/react';

interface StudentClassItem {
    id: number;
    subject: string;
    level: number;
    type: string;
    teacher_name: string;
    schedule_at: string;
    status: string;
    session: number;
}

interface StudentDataProps {
    id: number;
    name: string;
    enrolled_classes: StudentClassItem[];
    pending_classes: StudentClassItem[];
    stats: {
        enrolled_count: number;
        pending_count: number;
        next_schedule: {
            subject: string;
            meeting_number: number;
            date: string;
        } | null;
    };
}

interface DashboardProps {
    teacherData: TeacherProps | null;
    studentData?: StudentDataProps | null;
    stats?: {
        totalClasses?: number;
        totalTeachers?: number;
        totalStudents?: number;
    };
    isAdmin: boolean;
    userRole: string;
    userName: string;
}

const Dashboard = ({ teacherData, studentData, stats, isAdmin, userRole, userName }: DashboardProps) => {
    // Jika student, tampilkan dashboard student
    if (userRole === 'student') {
        const enrolledClasses = studentData?.enrolled_classes ?? [];
        const pendingClasses = studentData?.pending_classes ?? [];
        const nextSchedule = studentData?.stats?.next_schedule;

        return (
            <AuthenticatedLayout>
                <div className="flex-1 p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-xl mb-8">
                        <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-4 border border-white/20">
                                <Sparkles size={14} /> Student Learning Portal
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
                                Ahlan wa Sahlan, {userName}! 👋
                            </h1>
                            <p className="text-emerald-100 text-base lg:text-lg leading-relaxed mb-6">
                                Terus kembangkan potensi dan semangat belajarmu di PFG. Cek jadwal pertemuan dan modul belajarmu hari ini.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/classmanagement"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition active:scale-95"
                                >
                                    <BookOpen size={18} /> Lihat Kelas Saya
                                </Link>
                                <Link
                                    href="/classoffering"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800/40 text-white font-medium text-sm border border-emerald-400/30 hover:bg-emerald-800/60 transition active:scale-95"
                                >
                                    Jelajahi Kelas Baru <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Background decorative glow */}
                        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelas Aktif</p>
                                <h3 className="text-3xl font-black text-slate-800 mt-1">{studentData?.stats?.enrolled_count ?? 0}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Mata pelajaran yang diikuti</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Konfirmasi</p>
                                <h3 className="text-3xl font-black text-slate-800 mt-1">{studentData?.stats?.pending_count ?? 0}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Pendaftaran kelas diajukan</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <Calendar size={28} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sesi Mendatang</p>
                                {nextSchedule ? (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-800 truncate mt-1">
                                            {nextSchedule.subject} (Sesi {nextSchedule.meeting_number})
                                        </h3>
                                        <p className="text-xs text-blue-600 font-medium truncate mt-0.5">{nextSchedule.date}</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-base font-bold text-slate-800 mt-1">Belum Ada Sesi</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">Semua jadwal telah selesai</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pending classes notification banner if any */}
                    {pendingClasses.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
                            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">
                                    Anda memiliki {pendingClasses.length} pendaftaran kelas yang menunggu konfirmasi guru:
                                </h4>
                                <ul className="text-xs text-amber-800 mt-1 list-disc list-inside space-y-0.5">
                                    {pendingClasses.map((p) => (
                                        <li key={p.id}>
                                            <span className="font-semibold">{p.subject} (Level {p.level})</span> — Guru: {p.teacher_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Enrolled Classes Section */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Kelas yang Diikuti</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Daftar kelas aktif dan jadwal belajarmu</p>
                            </div>
                            <Link
                                href="/classmanagement"
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
                            >
                                Kelola Kelas <ChevronRight size={16} />
                            </Link>
                        </div>

                        {enrolledClasses.length === 0 ? (
                            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200">
                                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                    <BookOpen size={28} />
                                </div>
                                <h3 className="text-base font-bold text-slate-700">Belum Ada Kelas Terdaftar</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                                    Kamu belum terdaftar di kelas manapun. Yuk pilih kelas favoritmu di katalog kelas.
                                </p>
                                <Link
                                    href="/classoffering"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow hover:bg-emerald-700 transition"
                                >
                                    Daftar Kelas Sekarang
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrolledClasses.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-500/40 hover:shadow-md transition group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                    Level {item.level}
                                                </span>
                                                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                                                    {item.type}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                                                {item.subject}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                                <Users size={15} className="text-slate-400" /> Guru: {item.teacher_name}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
                                                <Clock size={14} className="text-emerald-600 shrink-0" />
                                                <span>{item.schedule_at}</span>
                                            </p>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <Link
                                                href={`/classmanagement/${item.id}`}
                                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition"
                                            >
                                                <Video size={16} /> Masuk Ruang Kelas
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Jika admin, tampilkan dashboard admin
    if (isAdmin || userRole === 'admin') {
        return (
            <AuthenticatedLayout>
                <div className="flex-1 p-6 bg-[#F3F4F9] min-h-screen font-sans">
                    {/* Admin Dashboard */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Welcome, {userName} 👋
                        </h1>
                        <p className="text-gray-600 text-lg">
                            This is the Admin Dashboard. You have full access to manage classes, teachers, and courses.
                        </p>
                    </div>

                    {/* Admin Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Total Classes</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalClasses ?? 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Total Teachers</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalTeachers ?? 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalStudents ?? 0}</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Jika teacher, tampilkan dashboard teacher
    // Pastikan teacherData tidak null
    if (!teacherData) {
        return (
            <AuthenticatedLayout>
                <div className="flex-1 p-6 bg-[#F3F4F9] min-h-screen font-sans">
                    <div className="bg-white p-8 rounded-3xl shadow-sm">
                        <p className="text-gray-600">Loading teacher data...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-6 bg-[#F3F4F9] min-h-screen font-sans">

                {/* HEADER SECTION */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">

                    {/* Welcome Card */}
                    <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm flex items-start space-x-6 relative">
                        <div className="hidden sm:block w-32 flex-shrink-0">
                            <img src="/images/icon-guru.png" alt="Teacher" className="w-full h-auto object-contain" />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome {teacherData.first_name}</h1>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Remember to begin your day with Bismillah. Also, your performance score has now
                                reached <span className="bg-red-500 text-white px-2 py-0.5 rounded-md font-bold">{teacherData.performance}%</span> out of the 75% standard.
                                Feel free to share this with the Super Teacher or the Curriculum Team. Insya Allah, it will become green!
                                May your study session go well, keep the spirit high!
                            </p>
                            <button className="bg-[#D4B982] text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-[#c4a972] transition">
                                Mood Booster
                            </button>
                        </div>
                    </div>

                    {/* Performance & Rating Sidebar */}
                    <div className="w-full lg:w-72 bg-white p-6 rounded-3xl shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-4 text-center">Teacher Performance</h3>
                        <div className="bg-red-500 text-white text-center py-2 rounded-lg font-bold text-xl mb-4">
                            {teacherData.performance} %
                        </div>

                        <div className="space-y-2 mb-6 text-sm font-medium">
                            <div className="flex items-center space-x-2 text-emerald-500">
                                <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
                                <span>High Performance</span>
                            </div>
                            <div className="flex items-center space-x-2 text-yellow-500">
                                <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                                <span>Medium Performance</span>
                            </div>
                            <div className="flex items-center space-x-2 text-red-500">
                                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                                <span>Low Performance</span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <p className="font-bold text-gray-700 mb-2">Rating: 4</p>
                            <div className="flex space-x-1">
                                {[...Array(4)].map((_, i) => <Star key={i} fill="#FACC15" color="#FACC15" size={20} />)}
                                <Star color="#D1D5DB" size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PENDING ATTENDANCE SECTION */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 flex justify-between items-center border-b border-gray-100">
                        <h2 className="text-red-500 font-bold text-xl flex items-center">
                            Pending Attendance <span className="ml-2 text-gray-400">🕒</span>
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="p-6">No</th>
                                    <th className="p-6">Class</th>
                                    <th className="p-6">Session</th>
                                    <th className="p-6">Session Schedule</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="p-6 font-bold">1</td>
                                    <td className="p-6 text-blue-500 font-semibold">ILC - 2.1 (Private) - Lv 3</td>
                                    <td className="p-6">2</td>
                                    <td className="p-6">Rabu, 4 Maret 2026 (19.00 WIB)</td>
                                    <td className="p-6 text-right">
                                        <button className="bg-[#D4B982] text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="p-6 flex justify-end items-center space-x-4 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <button className="hover:text-emerald-500"><ChevronsLeft size={20} /></button>
                            <button className="hover:text-emerald-500"><ChevronLeft size={20} /></button>
                            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-emerald-600 font-bold">1</span>
                            <button className="hover:text-emerald-500"><ChevronRight size={20} /></button>
                            <button className="hover:text-emerald-500"><ChevronsRight size={20} /></button>
                        </div>
                        <select className="border rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm">
                            <option>5 v</option>
                        </select>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
