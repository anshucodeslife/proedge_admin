import React from 'react';
import { Logo } from '../components/ui/Logo';

export const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-indigo-50/50 flex flex-col items-center justify-center p-4 font-sans">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <div className="text-center mb-8">
        {/* <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1> */}
        <p className="text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);
