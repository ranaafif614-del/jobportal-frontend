import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import Button from '../common/Button';

export default function SearchBar({
  initialSearch = '',
  initialLocation = '',
  onSearch,
  className = '',
}) {
  const [keyword, setKeyword] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword: keyword.trim(), location: location.trim() });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl p-2 md:p-3 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-2 ${className}`}
    >
      <div className="flex items-center gap-3 px-3 py-2 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100">
        <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Job title, keywords, or company..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-3 px-3 py-2 w-full md:w-2/5">
        <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="City, state, or remote..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
        />
      </div>

      <div className="w-full md:w-auto flex-shrink-0">
        <Button type="submit" size="md" className="w-full md:w-auto px-6">
          Find Jobs
        </Button>
      </div>
    </form>
  );
}