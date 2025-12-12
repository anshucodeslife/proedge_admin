import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, LayoutDashboard, Users, FileText, BookOpen, LogOut, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export const Topbar = ({ title, setMobileOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <header className="h-16 md:h-20 bg-[#0B1120] border-b border-[#1e293b] px-4 md:px-8 flex items-center justify-between shrink-0 relative z-30">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(true)}><Menu size={24} /></button>
        <h1 className="text-xl font-bold text-white hidden sm:block">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Mobile Search Toggle (Optional - using hidden for now, can add toggle later) */}
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-[#0f172a] text-sm w-40 lg:w-64 text-white focus:outline-none focus:ring-2 focus:ring-slate-700 placeholder-slate-500 transition-all" />
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 md:gap-3 pl-0 md:pl-4 md:border-l border-[#1e293b] focus:outline-none group"
          >
            <div className="text-right hidden lg:block">
              <div className="text-sm font-bold text-white group-hover:text-slate-200 transition-colors">Admin</div>
              <div className="text-xs text-slate-400">Proedge Admin</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              SA
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-[60]">
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-semibold text-slate-800">Administrator</p>
                <p className="text-xs text-slate-500 truncate">admin@proedge.com</p>
              </div>

              <div className="py-1">
                <div className="px-3 pb-1 pt-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Shortcuts</div>
                <Link to="/" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link to="/enquiries" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                  <FileText size={16} /> Enquiries
                </Link>
                <Link to="/students" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                  <Users size={16} /> Students
                </Link>
                <Link to="/courses" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                  <BookOpen size={16} /> Courses
                </Link>
              </div>

              <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
