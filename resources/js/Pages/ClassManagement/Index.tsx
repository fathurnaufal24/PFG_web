import React, { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

interface ClassData {
    id: number;
    subject: string;
    level: number;
    type: string;
    level_type: string;
    session: number;
    schedule: string;
    students: number;
    students_text: string;
    status: string;
    status_raw: string;
    teacher_name: string;
    note: string;
}

interface TabData {
    name: string;
    count: number;
}

interface Props {
    classes: ClassData[];
    tabs: TabData[];
    canCreate: boolean;
    canEdit: boolean;
}

const ClassManagementIndex = ({ classes, tabs, canCreate, canEdit }: Props) => {
    const [activeTab, setActiveTab] = useState("Active");
    const [searchTerm, setSearchTerm] = useState("");

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
                            className={`p-4 rounded-2xl shadow-sm cursor-pointer transition ${
                                activeTab === tab.name
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
                        {canCreate && (
                            <button
                                onClick={() => router.get('/classmanagement/create')}
                                className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition"
                            >
                                <Plus size={18} /> Add Class
                            </button>
                        )}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search by subject or teacher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="p-6">No</th>
                                    <th className="p-6">Subject</th>
                                    <th className="p-6">Level Type</th>
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
                                        <td colSpan={8} className="p-6 text-center text-gray-400">
                                            No classes found in {activeTab}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClasses.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                            <td className="p-6 font-bold">{index + 1}</td>
                                            <td className="p-6 font-semibold text-emerald-600">{item.subject}</td>
                                            <td className="p-6">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                    Level {item.level}
                                                </span>
                                                {' '}
                                                <span className="capitalize">{item.type}</span>
                                            </td>
                                            <td className="p-6">{item.session}</td>
                                            <td className="p-6 text-gray-500 text-sm">{item.schedule}</td>
                                            <td className="p-6 font-medium">{item.students_text}</td>
                                            <td className="p-6 text-sm">{item.teacher_name}</td>
                                            <td className="p-6">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => router.get(`/classmanagement/${item.id}`)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {canEdit && (
                                                        <>
                                                            <button
                                                                onClick={() => router.get(`/classmanagement/${item.id}/edit`)}
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClassManagementIndex;
