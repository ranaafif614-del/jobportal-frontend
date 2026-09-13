import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (variant) {
    case 'Applied':
      styleClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Under Review':
      styleClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Shortlisted':
      styleClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Interview':
      styleClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Hired':
      styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Rejected':
      styleClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'published':
    case 'active':
      styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'draft':
      styleClasses = 'bg-slate-100 text-slate-700 border-slate-300';
      break;
    case 'closed':
    case 'suspended':
      styleClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'candidate':
      styleClasses = 'bg-sky-50 text-sky-700 border-sky-200';
      break;
    case 'employer':
      styleClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'admin':
      styleClasses = 'bg-violet-50 text-violet-700 border-violet-200';
      break;
    case 'Remote':
      styleClasses = 'bg-teal-50 text-teal-700 border-teal-200';
      break;
    case 'Full Time':
      styleClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    default:
      styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
}