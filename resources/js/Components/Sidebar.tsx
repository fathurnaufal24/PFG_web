import logoPFG from './logo-sidebar.png';
import {
  LayoutDashboard, Users, Wallet, Calendar,
  BookOpen, Gift, Bell, UserPlus, LogOut, X,
  User, Settings
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const Sidebar = ({ isOpen, setIsOpen }: {isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;}) => {
  // Ambil data user dari Inertia
  const { props } = usePage();
  const user = props.auth.user;
  const isAdmin = user?.role === 'admin';

  // State untuk unread count
  const [unreadCount, setUnreadCount] = useState(0);

  // Ambil unread count dari props yang dikirim dari controller
  // atau fetch sendiri
  useEffect(() => {
    // Jika user bukan admin, ambil unread count
    if (!isAdmin) {
      // Ambil dari props jika sudah dikirim dari controller
      if (props.unreadCount !== undefined) {
        setUnreadCount(props.unreadCount as number);
      } else {
        // Atau fetch dari API
        fetch('/notifications/unread-count')
          .then(res => res.json())
          .then(data => setUnreadCount(data.count))
          .catch(() => {});
      }
    }
  }, [isAdmin, props.unreadCount]);

  const isStudent = user?.role === 'student';

  const menus = isStudent
    ? [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "dashboard" },
        { name: "Kelas Saya", icon: <Users size={20} />, path: "classmanagement" },
        { name: "Jadwal Saya", icon: <Calendar size={20} />, path: "schedule" },
        { name: "Modul Belajar", icon: <BookOpen size={20} />, path: "module" },
        { name: "Class Offering", icon: <Gift size={20} />, path: "classoffering" },
        {
          name: "Notifications",
          icon: <Bell size={20} />,
          path: "notifications",
          badge: unreadCount,
        },
      ]
    : [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "dashboard" },
        { name: "Class Management", icon: <Users size={20} />, path: "classmanagement" },
        { name: "Revenue", icon: <Wallet size={20} />, path: "revenue" },
        { name: "My Schedule", icon: <Calendar size={20} />, path: "schedule" },
        { name: "Module", icon: <BookOpen size={20} />, path: "module" },
        { name: "Class Offering", icon: <Gift size={20} />, path: "classoffering" },
        {
          name: "Notifications",
          icon: <Bell size={20} />,
          path: "notifications",
          badge: !isAdmin ? unreadCount : 0,
        },
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 shrink-0 h-screen shadow-2xl border-r border-slate-700/60
        bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col p-5
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shadow-inner shadow-emerald-500/20">
              <img src="/images/logo-sidebar.png" alt="Logo PFG" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Portal</p>
              <h1 className="text-lg font-bold text-white tracking-tight">PFG</h1>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-300 hover:text-white transition">
            <X size={22} />
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-700/80 bg-slate-800/60 p-3 shadow-lg shadow-slate-950/20">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 rounded-xl transition hover:bg-slate-700/80 group p-2"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
              {user?.name ? getInitials(user.name) : 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-slate-400 text-[11px] truncate">
                {user?.email || ''}
              </p>
            </div>

            <Settings size={16} className="text-slate-400 group-hover:text-white transition" />
          </Link>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          {menus.map((menu) => {
            const isActive = route().current(menu.path);
            const hasBadge = menu.badge && menu.badge > 0;

            return (
              <Link
                key={menu.name}
                href={route(menu.path)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-xl p-3 transition font-medium ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shadow-inner shadow-emerald-500/10'
                    : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${isActive ? 'text-emerald-300' : 'text-slate-300'}`}>{menu.icon}</span>
                  <span className="text-sm">{menu.name}</span>
                </div>
                {hasBadge && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {menu.badge > 99 ? '99+' : menu.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href='/logout'
          method='post'
          className="mt-4 flex items-center space-x-3 p-3 text-rose-300 font-medium cursor-pointer hover:bg-rose-500/10 hover:text-rose-200 rounded-xl border border-transparent hover:border-rose-500/20 transition"
          as="button"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;
