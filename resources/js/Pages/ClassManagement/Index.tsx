import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ClassManagementIndex = () => {
    const [activeTab, setActiveTab] = useState("Active");

    // Data kelas sesuai PDF Page 5, 13, 14, 15
    const classes = [
        { no: 1, subject: "QV-1.1-P1", level: "1", type: "Trial", session: "0", schedule: "Rabu, 18 Februari 2026 (19.00 WIB)", students: "1 Student", status: "Active" },
        { no: 2, subject: "IF-3.3", level: "1", type: "Regular", session: "0", schedule: "Rabu, 18 Februari 2026 (19.00 WIB)", students: "6 Student", status: "Active" },
        { no: 1, subject: "ILC-2.1", level: "3", type: "Private", session: "2", schedule: "Rabu, 4 Maret 2026 (19.00 WIB)", students: "1 Student", status: "Lesson Plan" },
        { no: 1, subject: "EQD-1.5", level: "1", type: "Regular", session: "1", schedule: "Selasa, 4 Maret 2026 (08.00 WIB)", students: "4 Student", status: "Report" },
        { no: 1, subject: "LP-A-2.4", level: "1", type: "Private", session: "1", schedule: "Rabu, 4 Maret 2026 (19.00 WIB)", students: "1 Student", status: "Parent Meeting" },
    ];

    const tabs = [
        { name: "Lesson Plan", count: 2 },
        { name: "Active", count: 1 },
        { name: "Report", count: 1 },
        { name: "Parent Meeting", count: 1 },
        { name: "Class Ended", count: 3 },
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-6 bg-[#F3F4F9] min-h-screen">
                <h2 className="text-2xl font-bold mb-6">Class Overview</h2>

                {/* Tabs Section (PDF Page 5) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {tabs.map((tab) => (
                        <div
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`p-4 rounded-2xl shadow-sm cursor-pointer transition ${activeTab === tab.name ? 'bg-emerald-500 text-white' : 'bg-white text-gray-500'}`}
                        >
                            <p className="text-xs font-medium uppercase tracking-wider">{tab.name}</p>
                            <h3 className="text-xl font-bold">{tab.count} Class</h3>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                            <Plus size={18} /> Add Class
                        </button>
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
                                    <th className="p-6">Subject</th>
                                    <th className="p-6">Level Type</th>
                                    <th className="p-6">Session</th>
                                    <th className="p-6">Release Schedule</th>
                                    <th className="p-6">Students</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {classes.filter(c => c.status === activeTab || activeTab === "Active").map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                        <td className="p-6 font-bold">{item.no}</td>
                                        <td className="p-6 font-semibold text-emerald-600">{item.subject}</td>
                                        <td className="p-6 text-xs uppercase"><span className="bg-gray-100 px-2 py-1 rounded">{item.level}</span> {item.type}</td>
                                        <td className="p-6">{item.session}</td>
                                        <td className="p-6 text-gray-500">{item.schedule}</td>
                                        <td className="p-6 font-medium">{item.students}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClassManagementIndex;
