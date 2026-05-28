import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';

const MySchedule = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-8 text-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">August 2026</h2>
                    <div className="space-x-2">
                        <button className="px-4 py-2 bg-white border rounded shadow-sm">Today</button>
                        <button className="px-4 py-2 bg-white border rounded shadow-sm text-gray-400">{'< Prev'}</button>
                        <button className="px-4 py-2 bg-white border rounded shadow-sm">{'Next >'}</button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                    <div className="grid grid-cols-7 bg-gray-50 border-b">
                        {days.map(day => (
                            <div key={day} className="p-4 text-center font-bold text-gray-600">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 min-h-[500px]">
                        {[...Array(35)].map((_, i) => (
                            <div key={i} className="border-r border-b p-2 min-h-[100px] hover:bg-gray-50 transition">
                                <span className="text-gray-400 text-xs">{i + 1}</span>
                                {/* Jadwal sesuai Page 18 PDF */}
                                {i === 8 && (
                                    <div className="mt-2 p-1 bg-emerald-100 text-emerald-700 text-[10px] rounded border border-emerald-200 font-bold">
                                        19.00-QV-1.4-P3
                                    </div>
                                )}
                                {i === 11 && (
                                    <div className="mt-2 p-1 bg-blue-100 text-blue-700 text-[10px] rounded border border-blue-200 font-bold">
                                        20.00-ILC-3.4 Lv 3
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MySchedule;
