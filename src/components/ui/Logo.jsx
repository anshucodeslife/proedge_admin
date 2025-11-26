import React from 'react';

export const Logo = ({ className = "" }) => (
  <div className={`flex items-center gap-2 font-bold text-2xl text-slate-800 ${className}`}>
    <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
      <span className="z-10 text-xl">P</span>
      <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
    </div>
    <div className="flex flex-col leading-none">
      <span className="tracking-tight text-indigo-900">Proedge</span>
      <span className="text-[0.6rem] text-slate-400 tracking-widest uppercase font-semibold">Learning</span>
    </div>
  </div>
);
