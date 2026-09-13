import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color = 'brand', subtext }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1 font-medium">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color] || colorMap.brand}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}