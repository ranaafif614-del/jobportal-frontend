import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Trash2, ExternalLink, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function ManageJobsAdminPage() {
  const { success, error } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.set('page', page);
      query.set('limit', '15');
      if (statusFilter !== 'all') query.set('status', statusFilter);
      if (search.trim()) query.set('search', search.trim());

      const res = await api.get(`/admin/jobs?${query.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data.jobs);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      error(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to remove job "${job.title}" by ${job.company}?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/jobs/${job._id}`);
      if (res.data.success) {
        success('Job posting removed by administrator');
        setJobs((prev) => prev.filter((j) => j._id !== job._id));
      }
    } catch (err) {
      error(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Job Moderation</h1>
        <p className="text-xs text-slate-500 mt-1">Review all vacancies across employers and remove inappropriate listings</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            Search
          </Button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="No job postings match your filter parameters."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/70 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Job Title & Company</th>
                  <th className="py-3.5 px-4">Employer Account</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date Posted</th>
                  <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {job.title}
                      <span className="block text-xs font-normal text-slate-500">
                        {job.company} • {job.location}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 font-mono">
                      {job.employer?.email || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                      {job.category?.name || 'General'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={job.status}>{job.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/jobs/${job.slug || job._id}`}
                          title="View Job Publicly"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job)}
                          title="Remove Job"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={(p) => fetchJobs(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}