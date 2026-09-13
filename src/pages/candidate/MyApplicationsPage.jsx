import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Building2,
  Trash2,
  ExternalLink,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatSalary } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function MyApplicationsPage() {
  const { success, error } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [historyModalApp, setHistoryModalApp] = useState(null);

  const statuses = ['all', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const query = selectedStatus !== 'all' ? `?status=${selectedStatus}` : '';
      const res = await api.get(`/applications/my${query}`);
      if (res.data.success) {
        setApplications(res.data.data.applications);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/applications/${appId}/withdraw`);
      if (res.data.success) {
        success('Application withdrawn successfully');
        setApplications((prev) => prev.filter((a) => a._id !== appId));
      }
    } catch (err) {
      error(err.message || 'Failed to withdraw application');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Job Applications</h1>
          <p className="text-xs text-slate-500 mt-1">Track status and timeline updates for all applied roles</p>
        </div>
        <Link to="/jobs">
          <Button size="sm">Browse More Openings</Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              selectedStatus === status
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications in this view"
          description="You have no applications matching this status. Explore our active listings to apply."
          actionText="Find Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {app.job?.title || 'Job Posting'}
                  </h3>
                  <Badge variant={app.status}>{app.status}</Badge>
                </div>

                <p className="text-sm font-medium text-slate-600">
                  {app.job?.company || 'Company'} • {app.job?.location} • {app.job?.jobType}
                </p>

                <p className="text-xs text-slate-400">
                  Applied on {formatDate(app.createdAt)} • Resume: {app.resumeOriginalName || 'Resume.pdf'}
                </p>

                {app.coverLetter && (
                  <p className="text-xs text-slate-500 line-clamp-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{app.coverLetter}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHistoryModalApp(app)}
                  className="text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Timeline
                </Button>

                {app.job && (
                  <Link to={`/jobs/${app.job.slug || app.job._id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      <ExternalLink className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      View Job
                    </Button>
                  </Link>
                )}

                {app.status !== 'Hired' && (
                  <button
                    onClick={() => handleWithdraw(app._id)}
                    title="Withdraw Application"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status History Timeline Modal */}
      {historyModalApp && (
        <Modal
          isOpen={!!historyModalApp}
          onClose={() => setHistoryModalApp(null)}
          title="Application Status History"
        >
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900">{historyModalApp.job?.title}</h4>
              <p className="text-xs text-slate-500">{historyModalApp.job?.company}</p>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {historyModalApp.statusHistory && historyModalApp.statusHistory.length > 0 ? (
                historyModalApp.statusHistory.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status}>{item.status}</Badge>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(item.changedAt)}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-slate-600 mt-1 font-medium">{item.note}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No status updates yet recorded.</p>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setHistoryModalApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}