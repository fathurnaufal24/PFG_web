import React from 'react';
import { Lock } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Module = () => {
    const modules = [
        { id: 1, title: "Qur'anic Vibrance", img: "https://via.placeholder.com/300x200?text=Quranic+Vibrance" },
        { id: 2, title: "Islamic Leadership & Collaboration", img: "https://via.placeholder.com/300x200?text=Leadership" },
        { id: 3, title: "Islamic Finance", img: "https://via.placeholder.com/300x200?text=Finance" },
        { id: 4, title: "STEM Creativity", img: "https://via.placeholder.com/300x200?text=STEM" },
        { id: 5, title: "Coaching Positive Future", img: "https://via.placeholder.com/300x200?text=Coaching" },
        { id: 6, title: "Language Project", img: "https://via.placeholder.com/300x200?text=Language" },
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-8 bg-[#F3F4F9] min-h-screen">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Module Curriculum</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((mod) => (
                        <div key={mod.id} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                            <div className="h-48 overflow-hidden">
                                <img src={mod.img} alt={mod.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-gray-800 mb-4">{mod.title}</h3>

                                <div className="space-y-3 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Teacher Name"
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Curriculume Code"
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
                                    />
                                </div>

                                <button className="mt-auto w-full bg-blue-600 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md">
                                    <Lock size={18} /> Unlock
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Module;
