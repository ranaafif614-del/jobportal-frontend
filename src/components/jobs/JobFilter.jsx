import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

export default function JobFilter({
  categories = [],
  selectedCategory,
  onCategoryChange,
  selectedJobTypes = [],
  onJobTypeToggle,
  selectedExperience = [],
  onExperienceToggle,
  isRemoteOnly,
  onRemoteToggle,
  onResetFilters,
}) {
  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Filter className="w-5 h-5 text-brand-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Remote Only Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Remote Only</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isRemoteOnly}
            onChange={(e) => onRemoteToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
        </label>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name} ({cat.jobCount || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Job Type Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Job Type
        </label>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={selectedJobTypes.includes(type)}
                onChange={() => onJobTypeToggle(type)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Experience Level
        </label>
        <div className="space-y-2">
          {experienceLevels.map((lvl) => (
            <label key={lvl} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={selectedExperience.includes(lvl)}
                onChange={() => onExperienceToggle(lvl)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>{lvl}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}