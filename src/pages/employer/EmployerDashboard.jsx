import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  Calendar,
  PlusCircle,
  Clock,
  ArrowRight,
  Eye,
  Building2
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs/employer/my-jobs?limit=10'),
          api.get('/applications/employer?limit=10')
        ]);

        if (jobsRes.data.success) {
          setJobs(jobsRes.data.data.jobs);
        }
        if (appsRes.data.success) {
          setApplications(appsRes.data.data.applications);
        }
      } catch (err) {
        console.error('Failed to load employer dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, []);

  const activeJobs = jobs.filter((j) => j.status === 'published').length;
  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const hiredCount = applications.filter((a) => a.status === 'Hired').length;

  return (
    <div className="space-y-8">
      {/* Welcome & Post CTA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {user?.employerProfile?.companyName || user?.name} Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your open positions, view applicants, and advance candidates through hiring stages.
          </p>
        </div>
        <Link to="/employer/jobs/new">
          <Button size="md" className="shadow-md shadow-brand-500/20">
            <PlusCircle className="w-4 h-4 mr-1.5" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Active Openings"
          value={activeJobs}
          icon={Briefcase}
          color="brand"
          subtext={`${jobs.length} total posted`}
        />
        <StatsCard
          title="Total Candidates"
          value={totalApplicants}
          icon={Users}
          color="blue"
          subtext="Applications received"
        />
        <StatsCard
          title="Shortlisted"
          value={shortlistedCount}
          icon={CheckCircle}
          color="purple"
        />
        <StatsCard
          title="Hired Talent"
          value={hiredCount}
          icon={Calendar}
          color="emerald"
        />
      </div>

      {/* Recent Applications Received */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Candidate Applications</h3>
            <p className="text-xs text-slate-500">Candidates who recently applied to your vacancies</p>
          </div>
          <Link
            to="/employer/applicants"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            Review All Applicants ({applications.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No applications received yet</p>
            <p className="text-xs text-slate-400 mb-4">Post new job openings to attract top tech talent</p>
            <Link to="/employer/jobs/new">
              <Button size="sm">Post a Job Opening</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Job Role</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {app.candidate?.name || 'Candidate'}
                      <span className="block text-xs font-normal text-slate-500">
                        {app.candidate?.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {app.job?.title || 'Job Position'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/employer/applicants"
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </Link>
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