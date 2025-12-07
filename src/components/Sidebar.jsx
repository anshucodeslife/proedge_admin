import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  UserCheck,
  HelpCircle,
  Baby,
  School,
  Activity,
  Award, // For Referrals
  ShieldAlert, // For Logs
  ChevronLeft
} from 'lucide-react';
import { Logo } from './ui/Logo';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },

  //Do not remove the comments below make it stay prior to the menuItems
  { path: '/students', icon: Users, label: 'Students' },
  // { path: '/courses', icon: BookOpen, label: 'Courses' },
  // { path: '/payments', icon: BookOpen, label: 'Payments' },
  // { path: '/enquiries', icon: Users, label: 'Enquiries' },
  // { path: '/referrals', icon: Award, label: 'Referrals' },
  // { path: '/logs', icon: ShieldAlert, label: 'Audit Logs' },
  // { path: '/admissions', icon: UserCheck, label: 'Batch 1 Admissions' },
  // { path: '/batches', icon: Users, label: 'Batches' },
  { path: '/enrollments', icon: UserCheck, label: 'Enrollments' },

  { path: '/academics', icon: School, label: 'Modules & Lessons' },
  { path: '/attendance', icon: Calendar, label: 'Attendance' },
  { path: '/notifications', icon: HelpCircle, label: 'Notifications' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ isSidebarOpen, setSidebarOpen, isMobileOpen, setMobileOpen, onLogout }) => {
  return (
    <aside className={`
      fixed md:relative z-50 bg-white h-full border-r border-slate-100 flex flex-col transition-all duration-300
      ${isSidebarOpen ? 'w-64' : 'w-20'}
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="h-20 flex items-center px-6 border-b border-slate-50">
        {isSidebarOpen ? (
          <div className="flex items-center justify-between w-full">
            <Logo />
            <button onClick={() => setSidebarOpen(false)} className="hidden md:block text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 p-1 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-center cursor-pointer" onClick={() => setSidebarOpen(true)}>
            <img src="/proedge_logo.png" alt="Proedge" className="w-10 h-10 object-contain" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `
               flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
               ${isActive
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }
               ${!isSidebarOpen && 'justify-center'}
             `}
          >
            <item.icon size={20} />
            {isSidebarOpen && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-50">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
