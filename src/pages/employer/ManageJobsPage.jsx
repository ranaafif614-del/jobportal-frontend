import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function ManageJobsPage() {
  const { success, error } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/employer/my-jobs?limit=50');
      if (res.data.success) {
        setJobs(res.data.data.jobs);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'published' ? 'closed' : 'published';
    try {
      const res = await api.patch(`/jobs/${job._id}/status`, { status: nextStatus });
      if (res.data.success) {
        success(`Job status changed to ${nextStatus}`);
        setJobs((prev) =>
          prev.map((j) => (j._id === job._id ? { ...j, status: nextStatus } : j))
        );
      }
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this job posting?')) {
      return;
    }

    try {
      const res = await api.delete(`/jobs/${id}`);
      if (res.data.success) {
        success('Job posting deleted successfully');
        setJobs((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      error(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Job Postings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, publish, or close vacancies posted by your company
          </p>
        </div>
        <Link to="/employer/jobs/new">
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" /> Post New Job
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading postings...
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job postings yet"
          description="You have not created any job listings. Click below to publish your first role."
          actionText="Create Job Posting"
          onAction={() => window.location.href = '/employer/jobs/new'}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/70 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Job Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Posted Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link
                        to={`/jobs/${job.slug || job._id}`}
                        className="hover:text-brand-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <span className="block text-xs font-normal text-slate-500">
                        {job.location} {job.isRemote && '(Remote)'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                      {job.category?.name || 'General'}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600">
                      {job.jobType}
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        to={`/employer/applicants?jobId=${job._id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-xs font-bold text-slate-700 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {job.applicantCount || 0}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={job.status}>{job.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(job)}
                          title={job.status === 'published' ? 'Close Job' : 'Publish Job'}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            job.status === 'published'
                              ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {job.status === 'published' ? 'Close' : 'Publish'}
                        </button>

                        {/* Edit Job */}
                        <Link
                          to={`/employer/jobs/edit/${job._id}`}
                          title="Edit Job"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete Job */}
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          title="Delete Job"
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
        </div>
      )}
    </div>
  );
}