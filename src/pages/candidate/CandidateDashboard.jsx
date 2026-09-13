import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  XCircle,
  Bookmark,
  ArrowRight,
  User,
  Briefcase
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appsRes, savedRes] = await Promise.all([
          api.get('/applications/my?limit=5'),
          api.get('/saved-jobs')
        ]);

        if (appsRes.data.success) {
          setApplications(appsRes.data.data.applications);
        }
        if (savedRes.data.success) {
          setSavedJobsCount(savedRes.data.data.savedJobs.length);
        }
      } catch (err) {
        console.error('Failed to load candidate dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const countByStatus = (status) =>
    applications.filter((app) => app.status === status).length;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your job applications, interviews, and saved opportunities here.
          </p>
        </div>
        <Link to="/jobs">
          <Button size="md" className="shadow-sm shadow-brand-500/20">
            Browse New Jobs
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={applications.length}
          icon={FileText}
          color="brand"
        />
        <StatsCard
          title="Under Review"
          value={countByStatus('Under Review')}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Shortlisted"
          value={countByStatus('Shortlisted')}
          icon={CheckCircle}
          color="purple"
        />
        <StatsCard
          title="Interviews"
          value={countByStatus('Interview')}
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* Profile & Resume Status Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Complete Your Candidate Profile</h3>
          <p className="text-xs text-brand-100 max-w-xl">
            Ensure your resume, skills, and past experience are up to date so verified hiring managers can discover you directly.
          </p>
        </div>
        <Link to="/candidate/profile">
          <Button variant="secondary" size="sm" className="bg-white text-brand-900 hover:bg-slate-100">
            Update Profile
          </Button>
        </Link>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
            <p className="text-xs text-slate-500">Live status of positions you have applied to</p>
          </div>
          <Link
            to="/candidate/applications"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            View All ({applications.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
            <p className="text-xs text-slate-400 mb-4">Start exploring roles and apply in one click</p>
            <Link to="/jobs">
              <Button size="sm">Search Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Job Type</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {app.job?.title || 'Job Position'}
                      <span className="block text-xs font-normal text-slate-500">
                        {app.job?.company || 'Company'} • {app.job?.location}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {app.job?.jobType}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {app.job ? (
                        <Link
                          to={`/jobs/${app.job.slug || app.job._id}`}
                          className="text-xs font-bold text-brand-600 hover:underline"
                        >
                          View Job
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}