import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Plus, Search, Eye, Pencil, Trash2, X,
    Users, Clock, Calendar, CheckCircle, XCircle,
    UserCheck, UserX, AlertCircle, Bell
} from 'lucide-react';

interface Course {
    id: number;
    subject: string;
    description: string | null;
}

interface AppliedTeacher {
    id: number;
    teacher_id: number;
    teacher_name: string;
    status: string;
    applied_at: string;
}

interface AcceptedTeacher {
    id: number;
    teacher_id: number;
    teacher_name: string;
    approved_at: string;
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
    applied_teachers: AppliedTeacher[];
    accepted_teacher: AcceptedTeacher | null;
    has_applied: boolean;
    application_status: string | null;
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
    });

    // Filter offerings
    const filteredOfferings = offerings.filter((item) => {
        const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse ? item.course_id === parseInt(selectedCourse) : true;
        const matchesArchive = showArchived ? true : !item.is_archived && !item.is_expired;
        return matchesSearch && matchesCourse && matchesArchive;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

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
        });
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
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditId(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = {
            ...formData,
            course_id: parseInt(formData.course_id),
            level: parseInt(formData.level),
            order: parseInt(formData.order),
            student: formData.student ? parseInt(formData.student) : 0,
            is_archived: formData.is_archived,
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

    const handleApply = (offeringId: number) => {
        if (confirm('Are you sure you want to apply for this offering?')) {
            router.post(`/classoffering/${offeringId}/apply`);
        }
    };

    const handleApprove = (offeringId: number, applicationId: number) => {
        if (confirm('Approve this teacher? This will reject all other pending applications.')) {
            router.post(`/classoffering/${offeringId}/approve/${applicationId}`);
        }
    };

    const handleReject = (offeringId: number, applicationId: number) => {
        if (confirm('Reject this teacher?')) {
            router.post(`/classoffering/${offeringId}/reject/${applicationId}`);
        }
    };

    const handleDelete = (id: number, subject: string) => {
        if (confirm(`Are you sure you want to delete offering "${subject}"?`)) {
            router.delete(`/classoffering/${id}`);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedOffering(expandedOffering === id ? null : id);
    };

    const getTypeBadge = (type: string) => {
        const styles = {
            trial: 'bg-purple-100 text-purple-700',
            regular: 'bg-blue-100 text-blue-700',
            private: 'bg-amber-100 text-amber-700',
        };
        return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            accepted: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-6 md:p-8 bg-[#F3F4F9] min-h-screen">
                <div className="max-w-7xl mx-auto">
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
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                            showArchived
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
                                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition ${
                                        offering.is_archived || offering.is_expired ? 'opacity-75' : ''
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
                                                        onClick={() => handleDelete(offering.id, offering.subject)}
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

                                        <div>
                                            <p className="text-gray-400 font-medium text-sm">Schedule</p>
                                            <p className="text-gray-700 font-medium">{offering.schedule_display}</p>
                                        </div>

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
                                                </div>
                                            </div>
                                        )}

                                        {/* Teacher Actions */}
                                        {!isAdmin && (
                                            <div className="pt-4 border-t border-gray-100">
                                                {offering.has_applied ? (
                                                    <div className={`px-4 py-2 rounded-xl text-sm font-medium text-center ${
                                                        offering.application_status === 'pending'
                                                            ? 'bg-yellow-50 text-yellow-700'
                                                            : offering.application_status === 'accepted'
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-red-50 text-red-700'
                                                    }`}>
                                                        {offering.application_status === 'pending' && '⏳ Waiting for approval...'}
                                                        {offering.application_status === 'accepted' && '✅ Accepted!'}
                                                        {offering.application_status === 'rejected' && '❌ Rejected'}
                                                    </div>
                                                ) : offering.can_apply ? (
                                                    <button
                                                        onClick={() => handleApply(offering.id)}
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
                                                        {offering.applied_teachers.map((teacher) => (
                                                            <div key={teacher.id} className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-800">{teacher.teacher_name}</p>
                                                                    <p className="text-xs text-gray-400">Applied: {teacher.applied_at}</p>
                                                                </div>
                                                                <div className="flex gap-2 w-full sm:w-auto">
                                                                    <button
                                                                        onClick={() => handleApprove(offering.id, teacher.id)}
                                                                        className="flex-1 sm:flex-none px-4 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-1"
                                                                    >
                                                                        <CheckCircle size={14} /> Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(offering.id, teacher.id)}
                                                                        className="flex-1 sm:flex-none px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-1"
                                                                    >
                                                                        <XCircle size={14} /> Reject
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Students
                                        </label>
                                        <input
                                            type="number"
                                            name="student"
                                            value={formData.student}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Schedule <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="schedule_at"
                                        value={formData.schedule_at}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Close Offering <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="close_offering"
                                        value={formData.close_offering}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Must be before schedule date</p>
                                </div>

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
        </AuthenticatedLayout>
    );
};

export default ClassOfferingIndex;
