import React from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Notifications = () => {
    const notifs = [
        {
            id: 1,
            status: "Accepted",
            type: "Trial",
            classCode: "QV - 1.1 - P1 (Lv 1)",
            message: "Hi Hadi Alhail, M.Pd., congratulations! You've been selected to teach this class. Our team will contact you soon for the next steps.",
            date: "Rabu, 18 Februari 2026 - 10.16 WIB",
            color: "emerald"
        },
        {
            id: 2,
            status: "Rejected",
            type: "Regular",
            classCode: "ILC - 10.2 (Lv 1)",
            message: "Hi Hadi Alhail, M.Pd., thank you for applying. We've decided to move forward with another candidate for this class. Wishing you all the best!",
            date: "Selasa, 17 Februari 2026 - 15.34 WIB",
            color: "red"
        }
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-8 bg-[#F3F4F9] min-h-screen">
                <div className="flex items-center gap-3 mb-8">
                    <Bell className="text-emerald-600" size={28} />
                    <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                </div>

                <div className="space-y-4 max-w-4xl">
                    {notifs.map((n) => (
                        <div key={n.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 flex gap-4 transition hover:shadow-md" style={{ borderLeftColor: n.color === 'emerald' ? '#10b981' : '#ef4444' }}>
                            <div className={`p-2 rounded-full h-fit ${n.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                {n.color === 'emerald' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">
                                        <span className={n.color === 'emerald' ? 'text-emerald-600' : 'text-red-600'}>{n.status}</span> - {n.type} - {n.classCode}
                                    </h3>
                                    <span className="text-xs text-gray-400 font-medium">{n.date}</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{n.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Notifications;
