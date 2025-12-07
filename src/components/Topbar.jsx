import React from 'react';
import { Menu, Search } from 'lucide-react';

export const Topbar = ({ title, setMobileOpen }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-500" onClick={() => setMobileOpen(true)}><Menu size={24} /></button>
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-slate-50 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-slate-700">Admin</div>
            <div className="text-xs text-slate-400">Proedge Admin</div>
          </div>
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">SA</div>
        </div>
      </div>
    </header>
  );
};
