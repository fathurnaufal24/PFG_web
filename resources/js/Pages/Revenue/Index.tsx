import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';

const RevenueIndex = () => {
    const dataGaji = [
        { no: 1, bulan: "Januari 2026", sesi: 27, jumlah: "Rp. 1.350.000" },
        { no: 2, bulan: "Februari 2026", sesi: 26, jumlah: "Rp. 1.300.000" },
        { no: 3, bulan: "Maret 2026", sesi: 27, jumlah: "Rp. 1.350.000" },
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Revenue History</h2> {/*  */}

                {/* Summary Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex justify-between items-center border-l-8 border-emerald-500">
                    <div>
                        <p className="text-gray-400 text-sm font-semibold">Total Salary Amount</p>
                        <h3 className="text-3xl font-bold text-emerald-600">Rp. 1.350.000</h3> {/* [cite: 584, 586] */}
                    </div>
                    <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold">Download Slip</button> {/* [cite: 585, 587] */}
                </div>

                {/* Table History */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-gray-600">No</th> {/* [cite: 590] */}
                                <th className="p-4 text-gray-600">Month</th> {/* [cite: 591] */}
                                <th className="p-4 text-gray-600 text-center">Session Quantity</th> {/* [cite: 583] */}
                                <th className="p-4 text-gray-600 text-center">Salary Amount</th> {/* [cite: 584] */}
                                <th className="p-4 text-gray-600 text-center">Salary Slip</th> {/* [cite: 585] */}
                            </tr>
                        </thead>
                        <tbody>
                            {dataGaji.map((item) => (
                                <tr key={item.no} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">{item.no}</td> {/* [cite: 593, 597, 601] */}
                                    <td className="p-4 font-medium">{item.bulan}</td> {/*  */}
                                    <td className="p-4 text-center">{item.sesi}</td> {/* [cite: 595, 599, 603] */}
                                    <td className="p-4 text-center font-bold text-emerald-600">{item.jumlah}</td> {/* [cite: 607, 606] */}
                                    <td className="p-4 text-center">
                                        <button className="text-blue-500 hover:underline">Slip</button> {/* [cite: 616, 617] */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default RevenueIndex;
