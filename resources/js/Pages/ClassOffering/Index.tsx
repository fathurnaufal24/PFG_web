import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
    Plus, Search, Eye, Pencil, Trash2, X,
    Users, Clock, Calendar, CheckCircle, XCircle,
    UserCheck, UserX, AlertCircle, Bell, Trash, Check
} from 'lucide-react';

interface Course {
    id: number;
    subject: string;
    description: string | null;
}

interface Preference {
    index: number;
    day: string;
    time: string;
    label: string;
}

interface AppliedTeacher {
    id: number;
    teacher_id: number;
    teacher_name: string;
    status: string;
    applied_at: string;
    selected_preference: number | null;
}

interface AcceptedTeacher {
    id: number;
    teacher_id: number;
    teacher_name: string;
    approved_at: string;
    selected_preference: number | null;
}

interface Offering {
    id: number;
    course_id: number;
    subject: string;
    level: number;
    period: string;
    order: number;
    type: string;
    student: number;
    schedule_at: string;
    schedule_display: string;
    close_offering: string;
    close_offering_display: string;
    note: string;
    is_archived: boolean;
    is_expired: boolean;
    preferences: Preference[];
    applied_teachers: AppliedTeacher[];
    accepted_teacher: AcceptedTeacher | null;
    has_applied: boolean;
    application_status: string | null;
    selected_preference: number | null;
    can_apply: boolean;
}

interface Props {
    offerings: Offering[];
    courses: Course[];
    isAdmin: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    unreadCount: number;
}

const ClassOfferingIndex = ({
    offerings,
    courses,
    isAdmin,
    canCreate,
    canEdit,
    canDelete,
    unreadCount
}: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedOffering, setExpandedOffering] = useState<number | null>(null);
    const [applyModalOffering, setApplyModalOffering] = useState<Offering | null>(null);
    const [selectedPreferenceIndex, setSelectedPreferenceIndex] = useState<number | null>(null);
    const [isApplyingOffering, setIsApplyingOffering] = useState(false);

    // Admin Action Modals State
    const pageProps = usePage<PageProps>().props;
    const flash = pageProps.flash;
    const [flashVisible, setFlashVisible] = useState(true);

    const [approveModalData, setApproveModalData] = useState<{
        offering: Offering;
        teacher: AppliedTeacher;
    } | null>(null);

    const [rejectModalData, setRejectModalData] = useState<{
        offering: Offering;
        teacher: AppliedTeacher;
    } | null>(null);

    const [deleteModalData, setDeleteModalData] = useState<{
        id: number;
        subject: string;
    } | null>(null);

    const [isProcessingAction, setIsProcessingAction] = useState(false);

    // Form state untuk preferences
    const [preferences, setPreferences] = useState<{ day: string; time: string }[]>([
        { day: '', time: '' }
    ]);

    const [formData, setFormData] = useState({
        course_id: '',
        type: '',
        level: '',
        period: '',
        order: '',
        student: '',
        schedule_at: '',
        close_offering: '',
        note: '',
        is_archived: false,
        has_deadline: false,
    });

    // Days and times options
    const days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday'
    ];

    const times = ['Morning', 'Afternoon', 'Evening', 'Night'];

    // Filter offerings
    const filteredOfferings = offerings.filter((item) => {
        const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse ? item.course_id === parseInt(selectedCourse) : true;

        // Sekarang logikanya benar:
        // - showArchived = false → tampilkan yang aktif (tidak archived dan tidak expired)
        // - showArchived = true → tampilkan yang archived atau expired
        const matchesArchive = !isAdmin && item.has_applied
            ? true // teacher tetap melihat offering yang sudah di-apply
            : showArchived
                ? item.is_archived || item.is_expired
                : !item.is_archived && !item.is_expired;

        return matchesSearch && matchesCourse && matchesArchive;
    });

    // --- Form Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handlePreferenceChange = (index: number, field: 'day' | 'time', value: string) => {
        const newPreferences = [...preferences];
        newPreferences[index][field] = value;
        setPreferences(newPreferences);
    };

    const addPreference = () => {
        setPreferences([...preferences, { day: '', time: '' }]);
    };

    const removePreference = (index: number) => {
        if (preferences.length <= 1) {
            alert('You need at least one preference.');
            return;
        }
        const newPreferences = preferences.filter((_, i) => i !== index);
        setPreferences(newPreferences);
    };

    // --- Modal Open/Close ---
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditId(null);
        setFormData({
            course_id: '',
            type: '',
            level: '',
            period: '',
            order: '',
            student: '',
            schedule_at: '',
            close_offering: '',
            note: '',
            is_archived: false,
            has_deadline: false,
        });
        setPreferences([{ day: '', time: '' }]);
        setIsModalOpen(true);
    };

    const openEditModal = (offering: Offering) => {
        setIsEditMode(true);
        setEditId(offering.id);
        setFormData({
            course_id: String(offering.course_id),
            type: offering.type,
            level: String(offering.level),
            period: offering.period,
            order: String(offering.order),
            student: String(offering.student || ''),
            schedule_at: offering.schedule_at || '',
            close_offering: offering.close_offering || '',
            note: offering.note || '',
            is_archived: offering.is_archived,
            has_deadline: !!offering.close_offering,
        });

        // Set preferences dari data yang ada
        if (offering.preferences && offering.preferences.length > 0) {
            setPreferences(offering.preferences.map(p => ({ day: p.day, time: p.time })));
        } else {
            setPreferences([{ day: '', time: '' }]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditId(null);
        }
    };

    // --- Submit ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validPreferences = preferences.filter(p => p.day && p.time);
        if (validPreferences.length === 0) {
            alert('Please add at least one valid preference (day and time).');
            setIsSubmitting(false);
            return;
        }

        const submitData = {
            ...formData,
            course_id: parseInt(formData.course_id),
            level: parseInt(formData.level),
            order: parseInt(formData.order),
            is_archived: formData.is_archived,
            preferences: validPreferences,
            has_deadline: formData.has_deadline,
            note: formData.note || null, // <-- TAMBAHKAN INI, kirim null jika kosong
        };

        if (isEditMode && editId) {
            router.put(`/classoffering/${editId}`, submitData, {
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        } else {
            router.post('/classoffering', submitData, {
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        }
    };

    // --- Actions ---
    const handleOpenApplyModal = (offering: Offering) => {
        setApplyModalOffering(offering);
        if (offering.preferences && offering.preferences.length === 1) {
            setSelectedPreferenceIndex(0);
        } else {
            setSelectedPreferenceIndex(null);
        }
    };

    const handleCloseApplyModal = () => {
        if (isApplyingOffering) return;
        setApplyModalOffering(null);
        setSelectedPreferenceIndex(null);
    };

    const handleSubmitApply = () => {
        if (!applyModalOffering || selectedPreferenceIndex === null) return;

        setIsApplyingOffering(true);
        router.post(`/classoffering/${applyModalOffering.id}/apply`, {
            selected_preference: selectedPreferenceIndex
        }, {
            onSuccess: () => {
                handleCloseApplyModal();
            },
            onFinish: () => {
                setIsApplyingOffering(false);
            }
        });
    };

    const handleConfirmApprove = () => {
        if (!approveModalData) return;
        setIsProcessingAction(true);
        router.post(`/classoffering/${approveModalData.offering.id}/approve/${approveModalData.teacher.id}`, {}, {
            onFinish: () => {
                setApproveModalData(null);
                setFlashVisible(true);
                setIsProcessingAction(false);
            }
        });
    };

    const handleConfirmReject = () => {
        if (!rejectModalData) return;
        setIsProcessingAction(true);
        router.post(`/classoffering/${rejectModalData.offering.id}/reject/${rejectModalData.teacher.id}`, {}, {
            onSuccess: () => {
                setRejectModalData(null);
                setFlashVisible(true);
            },
            onFinish: () => {
                setIsProcessingAction(false);
            }
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteModalData) return;
        setIsProcessingAction(true);
        router.delete(`/classoffering/${deleteModalData.id}`, {
            onSuccess: () => {
                setDeleteModalData(null);
                setFlashVisible(true);
            },
            onFinish: () => {
                setIsProcessingAction(false);
            }
        });
    };

    const toggleExpand = (id: number) => {
        setExpandedOffering(expandedOffering === id ? null : id);
    };

    // --- Helper Functions ---
    const getTypeBadge = (type: string) => {
        const styles = {
            trial: 'bg-purple-100 text-purple-700',
            regular: 'bg-blue-100 text-blue-700',
            private: 'bg-amber-100 text-amber-700',
        };
        return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    const getDayLabel = (day: string) => {
        const map: Record<string, string> = {
            'Monday': 'Senin',
            'Tuesday': 'Selasa',
            'Wednesday': 'Rabu',
            'Thursday': 'Kamis',
            'Friday': 'Jumat',
            'Saturday': 'Sabtu',
            'Sunday': 'Minggu'
        };
        return map[day] || day;
    };

    const getTimeLabel = (time: string) => {
        const map: Record<string, string> = {
            'Morning': 'Pagi',
            'Afternoon': 'Siang',
            'Evening': 'Sore',
            'Night': 'Malam'
        };
        return map[time] || time;
    };

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-6 md:p-8 bg-[#F3F4F9] min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Flash Message Banner */}
                    {flash?.success && flashVisible && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-emerald-600 shrink-0" size={20} />
                                <span className="text-sm font-semibold">{flash.success}</span>
                            </div>
                            <button
                                onClick={() => setFlashVisible(false)}
                                className="text-emerald-500 hover:text-emerald-700 p-1 rounded-lg hover:bg-emerald-100/50 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
                    {flash?.error && flashVisible && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-red-600 shrink-0" size={20} />
                                <span className="text-sm font-semibold">{flash.error}</span>
                            </div>
                            <button
                                onClick={() => setFlashVisible(false)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100/50 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-800">Class Offering</h2>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-gray-500 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Subjects</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.subject}
                                    </option>
                                ))}
                            </select>
                            {isAdmin && (
                                <>
                                    <button
                                        onClick={() => setShowArchived(!showArchived)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${showArchived
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {showArchived ? 'Showing Archived' : 'Show Archived'}
                                    </button>
                                    {canCreate && (
                                        <button
                                            onClick={openCreateModal}
                                            className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition whitespace-nowrap"
                                        >
                                            <Plus size={18} /> Add Offering
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80 mb-6">
                        <Search className="absolute left-3 top-2.5 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search offerings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                        />
                    </div>

                    {/* Offerings Grid */}
                    {filteredOfferings.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <p className="text-gray-400">No class offerings found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredOfferings.map((offering) => (
                                <div
                                    key={offering.id}
                                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition ${offering.is_archived || offering.is_expired ? 'opacity-75' : ''
                                        }`}
                                >
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {offering.subject}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadge(offering.type)}`}>
                                                        {offering.type}
                                                    </span>
                                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                                                        Level {offering.level}
                                                    </span>
                                                    {offering.is_archived && (
                                                        <span className="bg-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                                                            Archived
                                                        </span>
                                                    )}
                                                    {offering.is_expired && !offering.is_archived && (
                                                        <span className="bg-red-100 px-3 py-1 rounded-full text-xs font-medium text-red-600">
                                                            Expired
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {isAdmin && (
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => openEditModal(offering)}
                                                        className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModalData({ id: offering.id, subject: offering.subject })}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400 font-medium">Period</p>
                                                <p className="font-bold text-gray-700">{offering.period}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-medium">Order</p>
                                                <p className="font-bold text-gray-700">{offering.order}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-medium">Students</p>
                                                <p className="font-bold text-gray-700">{offering.student || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-medium">Applications</p>
                                                <p className="font-bold text-gray-700">{offering.applied_teachers.length}</p>
                                            </div>
                                        </div>

                                        {/* Preferences */}
                                        {offering.preferences && offering.preferences.length > 0 && (
                                            <div>
                                                <p className="text-gray-400 font-medium text-sm">Available Preferences</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {offering.preferences.map((pref, idx) => (
                                                        <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                                                            {getDayLabel(pref.day)} - {getTimeLabel(pref.time)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-gray-400 font-medium text-sm">Close Offering</p>
                                            <p className="text-gray-600 text-sm">{offering.close_offering_display}</p>
                                        </div>

                                        {offering.note && (
                                            <div>
                                                <p className="text-gray-400 font-medium text-sm">Note</p>
                                                <p className="text-gray-600 text-sm">{offering.note}</p>
                                            </div>
                                        )}

                                        {/* Accepted Teacher */}
                                        {offering.accepted_teacher && (
                                            <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
                                                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-green-700">Accepted Teacher</p>
                                                    <p className="text-sm text-green-600">
                                                        {offering.accepted_teacher.teacher_name}
                                                        <span className="text-xs text-green-400 ml-2">
                                                            (approved {offering.accepted_teacher.approved_at})
                                                        </span>
                                                    </p>
                                                    {offering.accepted_teacher.selected_preference !== null &&
                                                        offering.preferences[offering.accepted_teacher.selected_preference] && (
                                                            <p className="text-xs text-green-500">
                                                                Preference: {getDayLabel(offering.preferences[offering.accepted_teacher.selected_preference].day)} - {getTimeLabel(offering.preferences[offering.accepted_teacher.selected_preference].time)}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Teacher Actions */}
                                        {!isAdmin && (
                                            <div className="pt-4 border-t border-gray-100">
                                                {offering.has_applied ? (
                                                    <div className={`px-4 py-2 rounded-xl text-sm font-medium text-center ${offering.application_status === 'pending'
                                                        ? 'bg-yellow-50 text-yellow-700'
                                                        : offering.application_status === 'accepted'
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-red-50 text-red-700'
                                                        }`}>
                                                        {offering.application_status === 'pending' && '⏳ Waiting for approval...'}
                                                        {offering.application_status === 'accepted' && '✅ Accepted!'}
                                                        {offering.application_status === 'rejected' && '❌ Rejected'}
                                                        {offering.selected_preference !== null &&
                                                            offering.preferences[offering.selected_preference] && (
                                                                <span className="block text-xs mt-1 text-gray-500">
                                                                    Preference: {getDayLabel(offering.preferences[offering.selected_preference].day)} - {getTimeLabel(offering.preferences[offering.selected_preference].time)}
                                                                </span>
                                                            )}
                                                    </div>
                                                ) : offering.can_apply ? (
                                                    <button
                                                        onClick={() => handleOpenApplyModal(offering)}
                                                        className="w-full bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-600 transition"
                                                    >
                                                        Apply Now
                                                    </button>
                                                ) : (
                                                    <div className="text-center text-gray-400 text-sm">
                                                        {offering.is_archived ? 'Offering archived' : 'Not available'}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Admin - Applications List */}
                                        {isAdmin && offering.applied_teachers.length > 0 && (
                                            <div className="pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => toggleExpand(offering.id)}
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                                                >
                                                    <Users size={16} />
                                                    {expandedOffering === offering.id ? 'Hide' : 'Show'} Applications ({offering.applied_teachers.length})
                                                </button>

                                                {expandedOffering === offering.id && (
                                                    <div className="mt-3 space-y-3">
                                                        {offering.applied_teachers.map((teacher) => {
                                                            const pref = teacher.selected_preference !== null
                                                                ? offering.preferences[teacher.selected_preference]
                                                                : null;
                                                            return (
                                                                <div key={teacher.id} className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-gray-800">{teacher.teacher_name}</p>
                                                                        <p className="text-xs text-gray-400">Applied: {teacher.applied_at}</p>
                                                                        {pref && (
                                                                            <p className="text-xs text-emerald-600">
                                                                                Preferred: {getDayLabel(pref.day)} - {getTimeLabel(pref.time)}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                                        <button
                                                                            onClick={() => setApproveModalData({ offering, teacher })}
                                                                            className="flex-1 sm:flex-none px-4 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-1"
                                                                        >
                                                                            <CheckCircle size={14} /> Approve
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setRejectModalData({ offering, teacher })}
                                                                            className="flex-1 sm:flex-none px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-1"
                                                                        >
                                                                            <XCircle size={14} /> Reject
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {isAdmin && offering.applied_teachers.length === 0 && !offering.accepted_teacher && (
                                            <div className="pt-4 border-t border-gray-100 text-center text-gray-400 text-sm">
                                                No applications yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isEditMode ? 'Edit Offering' : 'Add New Offering'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                                disabled={isSubmitting}
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                {/* Course */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="course_id"
                                        value={formData.course_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.subject} - {course.description || 'No description'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Class Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="trial">Trial</option>
                                        <option value="regular">Regular</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                {/* Level, Period, Order, Student */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Level <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="level"
                                            value={formData.level}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g., 1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Period Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="period"
                                            value={formData.period}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g., 1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Order <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g., 1"
                                        />
                                    </div>
                                </div>

                                {/* Preferences - Hari & Waktu */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Schedule Preferences <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">Add one or more schedule preferences</p>

                                    {preferences.map((pref, index) => (
                                        <div key={index} className="flex gap-2 mb-2 items-end">
                                            <div className="flex-1">
                                                <select
                                                    value={pref.day}
                                                    onChange={(e) => handlePreferenceChange(index, 'day', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    required
                                                >
                                                    <option value="">Select Day</option>
                                                    {days.map((day) => (
                                                        <option key={day} value={day}>{getDayLabel(day)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <select
                                                    value={pref.time}
                                                    onChange={(e) => handlePreferenceChange(index, 'time', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    required
                                                >
                                                    <option value="">Select Time</option>
                                                    {times.map((time) => (
                                                        <option key={time} value={time}>{getTimeLabel(time)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removePreference(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                                                title="Remove preference"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addPreference}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 mt-2"
                                    >
                                        <Plus size={16} /> Add Preference
                                    </button>
                                </div>

                                {/* Schedule & Deadline */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <input
                                            type="checkbox"
                                            id="has_deadline"
                                            name="has_deadline"
                                            checked={formData.has_deadline}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="has_deadline" className="text-sm font-medium text-gray-700">
                                            Add Deadline
                                        </label>
                                    </div>

                                    {formData.has_deadline && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Close Offering <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="close_offering"
                                                value={formData.close_offering}
                                                onChange={handleInputChange}
                                                required={formData.has_deadline}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Teachers can apply until this date</p>
                                        </div>
                                    )}
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Note
                                    </label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                        placeholder="Add notes about this offering..."
                                    />
                                </div>

                                {/* Archived (Admin only) */}
                                {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_archived"
                                            name="is_archived"
                                            checked={formData.is_archived}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_archived" className="text-sm font-medium text-gray-700">
                                            Archived (hide from teachers)
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span> {isEditMode ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        isEditMode ? 'Update Offering' : 'Create Offering'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Apply Offering (Teacher) */}
            {applyModalOffering && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
                                    <Clock size={13} />
                                    Pilih Jadwal Mengajar
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Apply Class Offering
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Tentukan preferensi jadwal mengajar Anda untuk kelas ini.
                                </p>
                            </div>
                            <button
                                onClick={handleCloseApplyModal}
                                disabled={isApplyingOffering}
                                className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                            {/* Offering Overview Card */}
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50/80 rounded-2xl p-4 border border-gray-200/70">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                                        {applyModalOffering.subject}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize shrink-0 ${getTypeBadge(applyModalOffering.type)}`}>
                                        {applyModalOffering.type}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-gray-400 font-medium">Level:</span>
                                        <span className="font-semibold text-gray-700">Level {applyModalOffering.level}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-gray-400 font-medium">Periode:</span>
                                        <span className="font-semibold text-gray-700">{applyModalOffering.period}</span>
                                    </div>
                                    {applyModalOffering.student > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-400 font-medium">Siswa:</span>
                                            <span className="font-semibold text-gray-700">{applyModalOffering.student} Murid</span>
                                        </div>
                                    )}
                                    {applyModalOffering.close_offering_display && applyModalOffering.close_offering_display !== '-' && (
                                        <div className="flex items-center gap-1.5 col-span-2 text-gray-500">
                                            <span className="text-gray-400 font-medium">Batas Apply:</span>
                                            <span className="font-semibold text-gray-700">{applyModalOffering.close_offering_display}</span>
                                        </div>
                                    )}
                                </div>

                                {applyModalOffering.note && (
                                    <div className="mt-2.5 pt-2.5 border-t border-gray-200/60 text-xs text-gray-500">
                                        <span className="font-semibold text-gray-600">Catatan:</span> {applyModalOffering.note}
                                    </div>
                                )}
                            </div>

                            {/* Preferences Options */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Pilih Preferensi Waktu <span className="text-red-500">*</span>
                                </label>

                                {(!applyModalOffering.preferences || applyModalOffering.preferences.length === 0) ? (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-sm">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Tidak ada pilihan preferensi waktu</p>
                                            <p className="text-xs text-amber-700 mt-0.5">
                                                Offering ini belum memiliki opsi waktu. Silakan hubungi admin.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {applyModalOffering.preferences.map((pref, index) => {
                                            const isSelected = selectedPreferenceIndex === index;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setSelectedPreferenceIndex(index)}
                                                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                                                        isSelected
                                                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                                                            : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/70'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Radio Circle */}
                                                        <div
                                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                                                                isSelected
                                                                    ? 'border-emerald-600 bg-emerald-600'
                                                                    : 'border-gray-300 bg-white group-hover:border-emerald-400'
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <div className="w-2 h-2 rounded-full bg-white" />
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-gray-800">
                                                                    {getDayLabel(pref.day)}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    ({pref.day})
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                                                                <Clock size={13} className="text-emerald-600" />
                                                                <span>{getTimeLabel(pref.time)}</span>
                                                                <span className="text-gray-400">({pref.time})</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
                                                            <CheckCircle size={13} />
                                                            Dipilih
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
                            <button
                                type="button"
                                onClick={handleCloseApplyModal}
                                disabled={isApplyingOffering}
                                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitApply}
                                disabled={
                                    selectedPreferenceIndex === null ||
                                    isApplyingOffering ||
                                    !applyModalOffering.preferences ||
                                    applyModalOffering.preferences.length === 0
                                }
                                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-sm hover:shadow"
                            >
                                {isApplyingOffering ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Mengirim Lamaran...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} />
                                        Konfirmasi & Apply
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Approve Teacher (Admin) */}
            {approveModalData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                                    <UserCheck size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Approve Guru</h3>
                                    <p className="text-xs text-gray-500">Konfirmasi penerimaan guru untuk kelas ini</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !isProcessingAction && setApproveModalData(null)}
                                disabled={isProcessingAction}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs font-medium">Nama Guru:</span>
                                    <span className="font-bold text-gray-800">{approveModalData.teacher.teacher_name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs font-medium">Mata Pelajaran:</span>
                                    <span className="font-semibold text-gray-800">{approveModalData.offering.subject}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs font-medium">Level / Periode:</span>
                                    <span className="text-gray-700 font-medium">Lvl {approveModalData.offering.level} • {approveModalData.offering.period}</span>
                                </div>
                                {approveModalData.teacher.selected_preference !== null &&
                                    approveModalData.offering.preferences[approveModalData.teacher.selected_preference] && (
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span className="text-gray-500 text-xs font-medium">Jadwal Dipilih:</span>
                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md text-xs">
                                                {getDayLabel(approveModalData.offering.preferences[approveModalData.teacher.selected_preference].day)} - {getTimeLabel(approveModalData.offering.preferences[approveModalData.teacher.selected_preference].time)}
                                            </span>
                                        </div>
                                    )}
                            </div>

                            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
                                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <span>
                                    Menyetujui guru ini akan menolak semua lamaran guru lain untuk offering ini, mengarsipkan offering, dan otomatis membuat kelas di Class Management.
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setApproveModalData(null)}
                                disabled={isProcessingAction}
                                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmApprove}
                                disabled={isProcessingAction}
                                className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2 text-sm shadow-sm"
                            >
                                {isProcessingAction ? (
                                    <>
                                        <span className="animate-spin">⏳</span> Memproses...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} /> Ya, Approve Guru
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reject Teacher (Admin) */}
            {rejectModalData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                    <UserX size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Tolak Lamaran Guru</h3>
                                    <p className="text-xs text-gray-500">Konfirmasi penolakan lamaran guru</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !isProcessingAction && setRejectModalData(null)}
                                disabled={isProcessingAction}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                Apakah Anda yakin ingin menolak lamaran guru <strong className="text-gray-900 font-semibold">{rejectModalData.teacher.teacher_name}</strong> untuk offering <strong className="text-gray-900 font-semibold">{rejectModalData.offering.subject}</strong>?
                            </p>
                            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-500 shrink-0" />
                                <span>Notifikasi penolakan akan dikirimkan kepada guru terkait.</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setRejectModalData(null)}
                                disabled={isProcessingAction}
                                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmReject}
                                disabled={isProcessingAction}
                                className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2 text-sm shadow-sm"
                            >
                                {isProcessingAction ? (
                                    <>
                                        <span className="animate-spin">⏳</span> Menolak...
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={16} /> Ya, Tolak Lamaran
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Delete Offering (Admin) */}
            {deleteModalData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 flex flex-col overflow-hidden">
                        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                    <Trash2 size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Hapus Class Offering</h3>
                                    <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !isProcessingAction && setDeleteModalData(null)}
                                disabled={isProcessingAction}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600">
                                Apakah Anda yakin ingin menghapus offering <strong className="text-gray-900 font-semibold">{deleteModalData.subject}</strong>?
                            </p>
                        </div>
                        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalData(null)}
                                disabled={isProcessingAction}
                                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={isProcessingAction}
                                className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2 text-sm shadow-sm"
                            >
                                {isProcessingAction ? (
                                    <>
                                        <span className="animate-spin">⏳</span> Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} /> Ya, Hapus Offering
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default ClassOfferingIndex;
