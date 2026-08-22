import React, { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, X, BookOpen } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

interface ClassData {
    id: number;
    subject: string;
    level: number;
    type: string;
    session: number;
    schedule: string;
    students: number;
    students_text: string;
    status: string;
    status_raw: string;
    teacher_name: string;
    note: string;
    course_id?: number;
    period?: string;
    order?: number;
    teacher_id?: number | null;
    schedule_at?: string;
}

interface TabData {
    name: string;
    count: number;
}

interface Course {
    id: number;
    subject: string;
    description: string | null;
}

interface Props {
    classes: ClassData[];
    tabs: TabData[];
    canCreate: boolean;
    canEdit: boolean;
    courses?: Course[];
    userRole?: string;
}

const ClassManagementIndex = ({ classes, tabs, canCreate, canEdit, courses = [], userRole }: Props) => {
    const [activeTab, setActiveTab] = useState("Lesson Plan");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk Lesson Plan
    const [isLessonPlanModalOpen, setIsLessonPlanModalOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [isLessonPlanSubmitting, setIsLessonPlanSubmitting] = useState(false);
    const [lessonPlanData, setLessonPlanData] = useState({
        cdev: [] as string[],
        model: '',
        method: '',
        purpose: '',
        output: '',
        outcome: '',
    });

    const [formData, setFormData] = useState<{
        course_id: string;
        type: string;
        level: string;
        period: string;
        order: string;
        schedule_at: string;
        note: string;
        teacher_id: string | null;
        session: number;
        student: number;
    }>({
        course_id: '',
        type: '',
        level: '',
        period: '',
        order: '',
        schedule_at: '',
        note: '',
        teacher_id: null,
        session: 0,
        student: 0,
    });

    // Filter classes berdasarkan tab dan search
    const filteredClasses = classes.filter((item) => {
        const matchesTab = activeTab === "Active"
            ? item.status === "Active"
            : item.status === activeTab;

        const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const handleDelete = (id: number, subject: string) => {
        if (confirm(`Are you sure you want to delete class "${subject}"?`)) {
            router.delete(`/classmanagement/${id}`);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLessonPlanInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLessonPlanData({
            ...lessonPlanData,
            [e.target.name]: e.target.value
        });
    };

    const toggleCdev = (value: string) => {
        setLessonPlanData((prev) => {
            if (prev.cdev.includes(value)) {
                return { ...prev, cdev: prev.cdev.filter((item) => item !== value) };
            } else {
                return { ...prev, cdev: [...prev.cdev, value] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.course_id || !formData.type || !formData.level || !formData.period || !formData.order) {
            alert('Please fill in all required fields');
            setIsSubmitting(false);
            return;
        }

        const submitData = {
            course_id: parseInt(formData.course_id),
            type: formData.type,
            level: parseInt(formData.level),
            period: formData.period,
            order: parseInt(formData.order),
            schedule_at: formData.schedule_at || null,
            note: formData.note || null,
            teacher_id: formData.teacher_id ? parseInt(formData.teacher_id) : null,
            session: formData.session || 0,
            student: formData.student || 0,
        };

        if (isEditMode && editId) {
            router.put(`/classmanagement/${editId}`, submitData, {
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    alert('Failed to update class. Please check your input.');
                    setIsSubmitting(false);
                }
            });
        } else {
            router.post('/classmanagement', submitData, {
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    alert('Failed to create class. Please check your input.');
                    setIsSubmitting(false);
                }
            });
        }
    };

    const handleLessonPlanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLessonPlanSubmitting(true);

        if (lessonPlanData.cdev.length === 0) {
            alert('Please select at least one Cognitive Development.');
            setIsLessonPlanSubmitting(false);
            return;
        }

        if (!selectedClassId) {
            alert('Invalid class.');
            setIsLessonPlanSubmitting(false);
            return;
        }

        router.post(`/classmanagement/${selectedClassId}/lesson-plan`, lessonPlanData, {
            onSuccess: () => {
                closeLessonPlanModal();
                setIsLessonPlanSubmitting(false);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                alert('Failed to create lesson plan. Please check your input.');
                setIsLessonPlanSubmitting(false);
            }
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
            schedule_at: '',
            note: '',
            teacher_id: null,
            session: 0,
            student: 0,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (classData: ClassData) => {
        const fullData = classes.find(c => c.id === classData.id);
        if (!fullData) return;

        setIsEditMode(true);
        setEditId(classData.id);
        setFormData({
            course_id: String(fullData.course_id || ''),
            type: fullData.type,
            level: String(fullData.level),
            period: String(fullData.period || ''),
            order: String(fullData.order || '1'),
            schedule_at: fullData.schedule_at || '',
            note: fullData.note || '',
            teacher_id: fullData.teacher_id ? String(fullData.teacher_id) : null,
            session: fullData.session || 0,
            student: fullData.students || 0,
        });
        setIsModalOpen(true);
    };

    const openLessonPlanModal = (classId: number) => {
        setSelectedClassId(classId);
        setLessonPlanData({
            cdev: [],
            model: '',
            method: '',
            purpose: '',
            output: '',
            outcome: '',
        });
        setIsLessonPlanModalOpen(true);
    };

    const closeModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditId(null);
            setFormData({
                course_id: '',
                type: '',
                level: '',
                period: '',
                order: '',
                schedule_at: '',
                note: '',
                teacher_id: null,
                session: 0,
                student: 0,
            });
        }
    };

    const closeLessonPlanModal = () => {
        if (!isLessonPlanSubmitting) {
            setIsLessonPlanModalOpen(false);
            setSelectedClassId(null);
            setLessonPlanData({
                cdev: [],
                model: '',
                method: '',
                purpose: '',
                output: '',
                outcome: '',
            });
        }
    };

    const getTypeBadgeClass = (type: string) => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-medium capitalize";
        switch (type.toLowerCase()) {
            case 'trial':
                return `${baseClass} bg-purple-100 text-purple-700`;
            case 'regular':
                return `${baseClass} bg-blue-100 text-blue-700`;
            case 'private':
                return `${baseClass} bg-amber-100 text-amber-700`;
            default:
                return `${baseClass} bg-gray-100 text-gray-500`;
        }
    };

    const cdevOptions = [
        { value: 'c1', label: 'C1 - Remember' },
        { value: 'c2', label: 'C2 - Understanding' },
        { value: 'c3', label: 'C3 - Apply' },
        { value: 'c4', label: 'C4 - Analyze' },
        { value: 'c5', label: 'C5 - Evaluate' },
        { value: 'c6', label: 'C6 - Create' },
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-6 bg-[#F3F4F9] min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Class Overview</h2>
                </div>

                {/* Tabs Section */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {tabs.map((tab) => (
                        <div
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`p-4 rounded-2xl shadow-sm cursor-pointer transition ${activeTab === tab.name
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <p className="text-xs font-medium uppercase tracking-wider">{tab.name}</p>
                            <h3 className="text-xl font-bold">{tab.count} Class</h3>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {canCreate && activeTab === "Lesson Plan" && (
                                <button
                                    onClick={openCreateModal}
                                    className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition whitespace-nowrap"
                                >
                                    <Plus size={18} /> Add Class
                                </button>
                            )}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 text-gray-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search by subject or teacher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="p-6">No</th>
                                    <th className="p-6">Subject</th>
                                    <th className="p-6">Level</th>
                                    <th className="p-6">Type</th>
                                    <th className="p-6">Session</th>
                                    <th className="p-6">Release Schedule</th>
                                    <th className="p-6">Students</th>
                                    <th className="p-6">Teacher</th>
                                    <th className="p-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-6 text-center text-gray-400">
                                            No classes found in {activeTab}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClasses.map((item, index) => {
                                        // Cek apakah user adalah teacher dan statusnya inactive
                                        const isTeacher = userRole === 'teacher';
                                        const isInactive = item.status_raw === 'inactive';
                                        const showLessonPlanButton = isTeacher && isInactive && activeTab === 'Lesson Plan';

                                        return (
                                            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                                <td className="p-6 font-bold">{index + 1}</td>
                                                <td className="p-6 font-semibold text-emerald-600">{item.subject}</td>
                                                <td className="p-6">
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                        {item.level}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadgeClass(item.type)}`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="p-6">{item.session}</td>
                                                <td className="p-6 text-gray-500 text-sm">{item.schedule}</td>
                                                <td className="p-6 font-medium">{item.students_text}</td>
                                                <td className="p-6 text-sm">{item.teacher_name}</td>
                                                <td className="p-6">
                                                    <div className="flex justify-center gap-2">
                                                        {showLessonPlanButton ? (
                                                            // Tombol Start Lesson Plan untuk teacher dengan status inactive
                                                            <button
                                                                onClick={() => openLessonPlanModal(item.id)}
                                                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-600 transition flex items-center gap-2"
                                                                title="Start Lesson Plan"
                                                            >
                                                                <BookOpen size={16} /> Start Lesson Plan
                                                            </button>
                                                        ) : (
                                                            // Tombol View untuk role lain atau status bukan inactive
                                                            <button
                                                                onClick={() => router.get(`/classmanagement/${item.id}`)}
                                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                                                title="View"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        )}
                                                        {canEdit && (
                                                            <>
                                                                <button
                                                                    onClick={() => openEditModal(item)}
                                                                    className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item.id, item.subject)}
                                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Add/Edit Class */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isEditMode ? 'Edit Class' : 'Add New Class'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                                disabled={isSubmitting}
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body - Form */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                {/* Course Dropdown */}
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

                                {/* Class Type Dropdown */}
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

                                {/* Grid 2 kolom */}
                                <div className='grid grid-cols-2 gap-3'>
                                    {/* Level Input */}
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
                                            placeholder="Enter level (e.g., 1, 2, 3)"
                                        />
                                    </div>

                                    {/* Class Period Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Class Period Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="period"
                                            value={formData.period}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Enter period code (e.g., 1, 2, 3)"
                                        />
                                    </div>

                                    {/* Order Input */}
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
                                            placeholder="Enter order number (e.g., 1, 2, 3)"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Order number to sequence classes within the same period
                                        </p>
                                    </div>

                                    {/* Start Schedule */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Schedule
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="schedule_at"
                                            value={formData.schedule_at}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
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
                                        placeholder="Add any notes about this class..."
                                    />
                                </div>

                                {/* Hidden fields */}
                                <input type="hidden" name="session" value={formData.session} />
                                <input type="hidden" name="student" value={formData.student} />
                                <input type="hidden" name="teacher_id" value={formData.teacher_id || ''} />
                            </div>

                            {/* Modal Footer */}
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
                                        isEditMode ? 'Update Class' : 'Create Class'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Lesson Plan */}
            {isLessonPlanModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Start Lesson Plan
                            </h2>
                            <button
                                onClick={closeLessonPlanModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                                disabled={isLessonPlanSubmitting}
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleLessonPlanSubmit} className="p-6">
                            <div className="space-y-5">
                                {/* 1. Cognitive Development */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cognitive Development <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mb-2">Select one or more</p>
                                    <div className="flex flex-wrap gap-2">
                                        {cdevOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => toggleCdev(option.value)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${lessonPlanData.cdev.includes(option.value)
                                                        ? 'bg-emerald-500 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                    {lessonPlanData.cdev.length > 0 && (
                                        <p className="text-xs text-emerald-600 mt-2">
                                            Selected: {lessonPlanData.cdev.map(c => c.toUpperCase()).join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* 2. Learning Model */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Learning Model <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={lessonPlanData.model}
                                        onChange={handleLessonPlanInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Cooperative Learning, Project Based Learning"
                                    />
                                </div>

                                {/* 3. Learning Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Learning Method <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="method"
                                        value={lessonPlanData.method}
                                        onChange={handleLessonPlanInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Discussion, Demonstration, Simulation"
                                    />
                                </div>

                                {/* 4. Learning Purpose */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Learning Purpose <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="purpose"
                                        value={lessonPlanData.purpose}
                                        onChange={handleLessonPlanInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                        placeholder="Describe the purpose of this lesson..."
                                    />
                                </div>

                                {/* 5. Output Plan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Output Plan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="output"
                                        value={lessonPlanData.output}
                                        onChange={handleLessonPlanInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                        placeholder="Describe the expected output from this lesson..."
                                    />
                                </div>

                                {/* 6. Outcome Plan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Outcome Plan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="outcome"
                                        value={lessonPlanData.outcome}
                                        onChange={handleLessonPlanInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                        placeholder="Describe the expected outcome from this lesson..."
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeLessonPlanModal}
                                    disabled={isLessonPlanSubmitting}
                                    className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLessonPlanSubmitting}
                                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLessonPlanSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span> Saving...
                                        </>
                                    ) : (
                                        'Start Lesson'
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

export default ClassManagementIndex;