import React from 'react';
import { Users, Plus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ParentMeeting = () => {
    const students = [
        { name: "Muhammad Al-Fatih", date: "16 Maret 2026 (14.33 WIB)", status: "Belum PM", continuation: "PM Belum Terlaksana", statusColor: "gray" },
        { name: "Reza Alfian", date: "16 Maret 2026 (14.33 WIB)", status: "Hadir", continuation: "Lanjut", statusColor: "emerald" }
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-8 bg-[#F3F4F9] min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Users className="text-emerald-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-800">Parent Meeting</h2>
                    </div>
                    <button className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                        <Plus size={18} /> Create PM
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {students.map((s, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">Date: {s.date}</p>
                                <p className="text-xs text-gray-400 italic">Parent Review: -</p>
                            </div>

                            <div className="flex flex-col items-center min-w-[120px]">
                                <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Parent Meeting</span>
                                <span className={`px-4 py-1 rounded-full text-xs font-bold ${s.status === 'Hadir' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {s.status}
                                </span>
                            </div>

                            <div className="flex flex-col items-center min-w-[150px]">
                                <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Continuation</span>
                                <span className={`px-4 py-1 rounded-full text-xs font-bold ${s.continuation === 'Lanjut' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {s.continuation}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ParentMeeting;
