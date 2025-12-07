import React from 'react';

export const Logo = ({ className = "" }) => (
  <div className={`flex items-center gap-2 font-bold text-xl text-slate-800 ${className}`}>
    <img src="/proedge_logo.png" alt="Proedge Learning" className="w-10 h-10 object-contain" />
    <div className="flex flex-col items-start leading-none">
      <span className="tracking-tight text-orange-500">Proedge</span>
      <span className="tracking-tight text-slate-800">Learning</span>
    </div>
  </div>
);
