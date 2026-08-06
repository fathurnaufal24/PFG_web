import logoPFG from './logo-sidebar.png';
import {
  LayoutDashboard, Users, Wallet, Calendar,
  BookOpen, Gift, Bell, UserPlus, LogOut, X,
  User, Settings // Tambahkan icon User dan Settings
} from 'lucide-react';
import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const Sidebar = ({ isOpen, setIsOpen }: {isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;}) => {
  // Ambil data user dari Inertia
  const { props } = usePage();
  const user = props.auth.user; // Sesuaikan dengan struktur data Anda

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

  // Ambil inisial nama untuk avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Overlay */}
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
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <img src="/images/logo-sidebar.png" alt="Logo PFG" className="w-12 h-12 object-contain" />
            <h1 className="text-xl font-bold text-white tracking-tight">PFG Portal</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* User Profile Section - TAMBAHKAN INI */}
        <div className="mb-6 border-b border-gray-700 pb-4">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 p-2 rounded-xl transition hover:bg-gray-700/50 group"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name ? getInitials(user.name) : 'U'}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {user?.email || ''}
              </p>
            </div>

            {/* Icon Settings/Chevron */}
            <Settings size={16} className="text-gray-400 group-hover:text-white transition" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menus.map((menu) => (
            <Link
              key={menu.name}
              href={route(menu.path)}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-xl transition font-medium ${
                route().current(menu.path)
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-white hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {menu.icon}
              <span className="text-sm">{menu.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <Link
          href='/logout'
          method='post'
          className="mt-4 flex items-center space-x-3 p-3 text-red-400 font-medium cursor-pointer hover:bg-red-500/10 hover:text-red-300 rounded-xl transition"
          as="button"
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
