import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';

const ClassOffering = () => {
    const offerings = [
        {
            id: 1, title: "IE (Lvl. 5)", type: "Small", level: "Level 5",
            time: "JUMAT - MALAM", students: "1 Student", ages: "11 YO",
            date: "23/01 -- Jm 19.00 wib", posted: "52 days ago"
        },
        {
            id: 2, title: "IE (Lvl. 1)", type: "Private", level: "Level 1",
            time: "SABTU - PAGI, SABTU - SIANG, MINGGU - PAGI", students: "1 Student",
            ages: "6 YO", date: "20/02 -- secepatnya", posted: "24 days ago"
        }
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Class Offering <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm">10</span></h2> [cite: 681]
                    <select className="border p-2 rounded-lg text-gray-500 bg-white">
                        <option>Choose subject</option> [cite: 696]
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {offerings.map((item) => (
                        <div key={item.id} className="bg-white border rounded-xl p-6 shadow-sm relative overflow-hidden">
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded text-xs font-bold text-white ${item.type === 'Small' ? 'bg-sky-400' : 'bg-orange-500'}`}>
                                {item.type} [cite: 692, 697]
                            </div>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3> [cite: 682, 693]

                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                <div>
                                    <p className="text-gray-400 font-medium">Course Level</p>
                                    <p className="font-bold text-gray-700">{item.level}</p> [cite: 685, 694]
                                </div>
                                <div>
                                    <p className="text-gray-400 font-medium">Students</p>
                                    <p className="font-bold text-gray-700">{item.students}</p> [cite: 687, 700]
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-400 font-medium">Time Preference</p>
                                    <p className="font-bold text-gray-700 uppercase">{item.time}</p> [cite: 686, 695]
                                </div>
                                <div>
                                    <p className="text-gray-400 font-medium">Student Ages</p>
                                    <p className="font-bold text-gray-700">{item.ages}</p>
                                </div>
                            </div>

                            <p className="text-xs text-emerald-600 font-medium italic mb-6">{item.date} -- Secepatnya</p>

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">{item.posted}</span> [cite: 691, 709]
                                <button className="bg-emerald-500 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-600 transition">Apply</button> [cite: 708, 710]
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClassOffering;
