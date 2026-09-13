import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  FileText,
  ShieldCheck,
  Building2,
  User,
  ArrowRight,
  Clock,
  Activity
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/statistics');
        if (res.data.success) {
          setStats(res.data.data.statistics);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
        Loading platform intelligence & metrics...
      </div>
    );
  }

  const { users, jobs, applications, recent } = stats;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Administration</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global metrics, account moderation, job categories, and system telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/users">
            <Button size="sm" variant="outline">
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/jobs">
            <Button size="sm">
              Moderate Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* High-level stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard title="Total Users" value={users.total} icon={Users} color="brand" />
        <StatsCard title="Candidates" value={users.candidates} icon={User} color="blue" />
        <StatsCard title="Employers" value={users.employers} icon={Building2} color="purple" />
        <StatsCard title="Total Jobs" value={jobs.total} icon={Briefcase} color="amber" />
        <StatsCard title="Active Jobs" value={jobs.active} icon={ShieldCheck} color="emerald" />
        <StatsCard title="Applications" value={applications.total} icon={FileText} color="rose" />
      </div>

      {/* Application Funnel Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Application Pipeline Distribution</h3>
            <p className="text-xs text-slate-500">Live candidate volume across pipeline hiring stages</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Total: {applications.total}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {Object.entries(applications.byStatus).map(([st, count]) => (
            <div key={st} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <Badge variant={st}>{st}</Badge>
              <p className="text-xl font-extrabold text-slate-900 mt-2">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Recent Registrations & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent User Registrations</h3>
            <Link to="/admin/users" className="text-xs font-bold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recent.users.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{u.name}</p>
                  <p className="text-slate-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={u.role}>{u.role}</Badge>
                  <Badge variant={u.status}>{u.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Job Postings</h3>
            <Link to="/admin/jobs" className="text-xs font-bold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recent.jobs.map((j) => (
              <div key={j._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{j.title}</p>
                  <p className="text-slate-400">{j.company} • {j.category?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={j.jobType}>{j.jobType}</Badge>
                  <Badge variant={j.status}>{j.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}