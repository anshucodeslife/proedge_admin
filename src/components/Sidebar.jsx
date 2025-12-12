import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Award,
  ShieldAlert,
  ChevronLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Logo } from './ui/Logo';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admissions', icon: UserCheck, label: 'Admissions' },

  {
    label: 'People',
    icon: Users,
    children: [
      { path: '/students', label: 'Students' },
      { path: '/tutors', label: 'Tutors' },
      { path: '/users', label: 'Users' },
    ]
  },

  {
    label: 'Academics',
    icon: School,
    children: [
      { path: '/courses', label: 'Courses' },
      { path: '/academics', label: 'Modules & Lessons' },
      { path: '/batches', label: 'Batches' },
      { path: '/enrollments', label: 'Assign Course' },
    ]
  },

  { path: '/attendance', icon: Calendar, label: 'Attendance' },
  { path: '/referrals', icon: Award, label: 'Referrals' },
  { path: '/enquiries', icon: Users, label: 'Enquiries' },
  { path: '/payments', icon: BookOpen, label: 'Payments' },

  {
    label: 'System',
    icon: Settings,
    children: [
      { path: '/notifications', label: 'Notifications' },
      { path: '/logs', label: 'Audit Logs' },
      { path: '/settings', label: 'Settings' },
    ]
  }
];

export const Sidebar = ({ isSidebarOpen, setSidebarOpen, isMobileOpen, setMobileOpen, onLogout }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (label) => {
    if (!isSidebarOpen) setSidebarOpen(true);
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActiveLink = (path) => location.pathname === path;
  const isParentActive = (children) => children.some(child => isActiveLink(child.path));

  return (
    <aside className={`
      fixed md:relative z-50 h-full flex flex-col transition-all duration-300
      ${isSidebarOpen ? 'w-64' : 'w-20'}
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      bg-[#0B1120] border-r border-[#0B1120] shadow-xl
    `}>
      <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-white">
        {isSidebarOpen ? (
          <div className="flex items-center justify-between w-full">
            <Logo />
            <button onClick={() => setSidebarOpen(false)} className="hidden md:block text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 p-1.5 rounded-lg transition-colors">
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
        {menuItems.map((item, index) => {
          if (item.children) {
            const isOpen = openMenus[item.label] || isParentActive(item.children);
            const parentActive = isParentActive(item.children);

            return (
              <div key={index}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`
                    w-full flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 group
                    ${parentActive ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white'}
                  `}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={parentActive ? 'text-accent-500' : 'text-slate-400 group-hover:text-white'} />
                    {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </div>
                  {isSidebarOpen && (
                    isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </button>

                {/* Submenu */}
                {isSidebarOpen && isOpen && (
                  <div className="mt-2 ml-4 pl-4 border-l border-brand-800 space-y-1">
                    {item.children.map((child, childIndex) => (
                      <NavLink
                        key={childIndex}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => `
                          block px-3 py-2 rounded-lg text-sm transition-colors
                          ${isActive
                            ? 'text-accent-400 font-medium translate-x-1'
                            : 'text-slate-400 hover:text-white hover:translate-x-1'
                          }
                        `}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                 flex items-center gap-3 px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 group
                 ${isActive
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/20'
                  : 'text-slate-400 hover:bg-[#0f172a] hover:text-white'
                }
                 ${!isSidebarOpen && 'justify-center'}
               `}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} className={isActiveLink(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#1e293b] bg-[#0B1120]">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors ${!isSidebarOpen && 'justify-center'}`}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
