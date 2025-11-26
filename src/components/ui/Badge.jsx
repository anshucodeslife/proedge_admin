import React from 'react';

export const Badge = ({ children, variant = 'primary' }) => {
  const styles = {
    primary: "bg-emerald-50 text-emerald-600",
    secondary: "bg-indigo-50 text-indigo-600",
    warning: "bg-amber-50 text-amber-600",
    neutral: "bg-slate-100 text-slate-600",
    danger: "bg-red-50 text-red-600"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
};
