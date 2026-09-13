import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import SearchBar from '../../components/jobs/SearchBar';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import { JobCardSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Parse state from URL params
  const search = searchParams.get('search') || '';
  const locationParam = searchParams.get('location') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedJobTypes = searchParams.get('jobType') ? searchParams.get('jobType').split(',') : [];
  const selectedExperience = searchParams.get('experienceLevel') ? searchParams.get('experienceLevel').split(',') : [];
  const isRemoteOnly = searchParams.get('isRemote') === 'true';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch jobs whenever URL params change
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(searchParams);
      if (!query.has('limit')) query.set('limit', '9');

      const res = await api.get(`/jobs?${query.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data.jobs);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Handlers to update URL search params
  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(val)) {
        newParams.set(key, val.join(','));
      } else {
        newParams.set(key, val.toString());
      }
    });
    // Reset page on filter changes unless page was explicitly updated
    if (!updates.page) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = ({ keyword, location }) => {
    updateParams({ search: keyword, location });
  };

  const handleJobTypeToggle = (type) => {
    const updated = selectedJobTypes.includes(type)
      ? selectedJobTypes.filter((t) => t !== type)
      : [...selectedJobTypes, type];
    updateParams({ jobType: updated });
  };

  const handleExperienceToggle = (lvl) => {
    const updated = selectedExperience.includes(lvl)
      ? selectedExperience.filter((l) => l !== lvl)
      : [...selectedExperience, lvl];
    updateParams({ experienceLevel: updated });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
          Browse All Available Opportunities
        </h1>
        <SearchBar
          initialSearch={search}
          initialLocation={locationParam}
          onSearch={handleSearchSubmit}
        />
      </div>

      {/* Main Grid: Sidebar + Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showMobileFilter ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24">
            <JobFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(catId) => updateParams({ category: catId })}
              selectedJobTypes={selectedJobTypes}
              onJobTypeToggle={handleJobTypeToggle}
              selectedExperience={selectedExperience}
              onExperienceToggle={handleExperienceToggle}
              isRemoteOnly={isRemoteOnly}
              onRemoteToggle={(rem) => updateParams({ isRemote: rem ? 'true' : '' })}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Jobs Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              Found <span className="font-bold text-slate-900">{pagination.total}</span> positions matching your search
            </p>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sort:
              </label>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="latest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="salary_high">Highest Salary</option>
                <option value="salary_low">Lowest Salary</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Job Cards or Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No matching job postings found"
              description="Try clearing some filters or searching with a different keyword or location."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={(p) => updateParams({ page: p })}
          />
        </div>
      </div>
    </div>
  );
}