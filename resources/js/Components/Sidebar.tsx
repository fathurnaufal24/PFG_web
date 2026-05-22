import logoPFG from './logo-sidebar.png'; // Sesuaikan nama filenya
import {
  LayoutDashboard, Users, Wallet, Calendar,
  BookOpen, Gift, Bell, UserPlus, LogOut, X
} from 'lucide-react';
import React from 'react';
import NavLink from './NavLink';
import { Link } from '@inertiajs/react';

const Sidebar = ({ isOpen, setIsOpen }: {isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;}) => { // Tambahin props ini

  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "dashboard" },
    { name: "Class Management", icon: <Users size={20} />, path: "classmanagement" },
    { name: "Revenue", icon: <Wallet size={20} />, path: "revenue" },
    { name: "My Schedule", icon: <Calendar size={20} />, path: "schedule" },
    { name: "Module", icon: <BookOpen size={20} />, path: "module" },
    { name: "Class Offering", icon: <Gift size={20} />, path: "classoffering" },
    { name: "Notifications", icon: <Bell size={20} />, path: "notifications" },
    { name: "Parent Meeting", icon: <UserPlus size={20} />, path: "parentmeeting" },
  ];

  return (
    <>
      {/* Overlay: Layar item transparan pas Sidebar muncul di HP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Utama */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 shrink-0 bg-[#1E293B] h-screen shadow-xl p-6
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col
      `}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-2">
            <img src="/images/logo-sidebar.png" alt="Logo PFG" className="w-12 h-12 object-contain" />
            <h1 className="text-xl font-bold text-white tracking-tight">PFG Portal</h1>
          </div>
          {/* Tombol Close cuma muncul di HP */}
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menus.map((menu) => (
            <Link
              key={menu.name}
              href={route(menu.path)}
              onClick={() => setIsOpen(false)} // Klik menu = Sidebar tutup di HP
              className={`flex items-center space-x-3 p-3 rounded-xl transition font-medium ${
                route().current(menu.path)
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-white hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              {menu.icon}
              <span className="text-sm">{menu.name}</span>
            </Link>
          ))}
        </nav>

        <div
        className="pt-10 flex items-center space-x-3 p-3 text-red-500 font-bold cursor-pointer hover:bg-red-50 rounded-xl transition"
      >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
