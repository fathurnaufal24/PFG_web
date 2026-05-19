import React from 'react';
import { Star, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
// import teacherIllustration from './icon-guru.png';

const Dashboard = () => {
  return (
    <div className="flex-1 p-6 bg-[#F3F4F9] min-h-screen font-sans">

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">

        {/* Welcome Card */}
        <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm flex items-start space-x-6 relative">
          {/* 2. PAKE TAG <img> DI SINI */}
          <div className="hidden sm:block w-32 flex-shrink-0">
            <img src="/images/icon-guru.png" alt="Teacher" className="w-full h-auto object-contain" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Fathurrahman Naufal, M.kom.</h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              Remember to begin your day with Bismillah. Also, your performance score has now
              reached <span className="bg-red-500 text-white px-2 py-0.5 rounded-md font-bold">61.19%</span> out of the 75% standard.
              Feel free to share this with the Super Teacher or the Curriculum Team. Insya Allah, it will become green!
              May your study session go well, keep the spirit high!
            </p>
            <button className="bg-[#D4B982] text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-[#c4a972] transition">
              Mood Booster
            </button>
          </div>
        </div>

        {/* Performance & Rating Sidebar */}
        <div className="w-full lg:w-72 bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4 text-center">Teacher Performance</h3>
          <div className="bg-red-500 text-white text-center py-2 rounded-lg font-bold text-xl mb-4">
            61.19 %
          </div>

          <div className="space-y-2 mb-6 text-sm font-medium">
            <div className="flex items-center space-x-2 text-emerald-500">
              <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
              <span>High Performance</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-500">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
              <span>Medium Performance</span>
            </div>
            <div className="flex items-center space-x-2 text-red-500">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span>Low Performance</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="font-bold text-gray-700 mb-2">Ranting: 4</p>
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => <Star key={i} fill="#FACC15" color="#FACC15" size={20} />)}
              <Star color="#D1D5DB" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* PENDING ATTENDANCE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-red-500 font-bold text-xl flex items-center">
            Pending Attendance <span className="ml-2 text-gray-400">🕒</span>
          </h2>
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
                <th className="p-6">Class</th>
                <th className="p-6">Session</th>
                <th className="p-6">Session Schedule</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-6 font-bold">1</td>
                <td className="p-6 text-blue-500 font-semibold">ILC - 2.1 (Private) - Lv 3</td>
                <td className="p-6">2</td>
                <td className="p-6">Rabu, 4 Maret 2026 (19.00 WIB)</td>
                <td className="p-6 text-right">
                  <button className="bg-[#D4B982] text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-6 flex justify-end items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-2">
            <button className="hover:text-emerald-500"><ChevronsLeft size={20} /></button>
            <button className="hover:text-emerald-500"><ChevronLeft size={20} /></button>
            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-emerald-600 font-bold">1</span>
            <button className="hover:text-emerald-500"><ChevronRight size={20} /></button>
            <button className="hover:text-emerald-500"><ChevronsRight size={20} /></button>
          </div>
          <select className="border rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm">
            <option>5 v</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
