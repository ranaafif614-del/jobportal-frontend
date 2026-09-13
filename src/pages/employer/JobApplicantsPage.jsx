import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function JobApplicantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error } = useToast();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  const jobId = searchParams.get('jobId') || '';
  const statusFilter = searchParams.get('status') || 'all';

  const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (jobId) query.set('jobId', jobId);
      if (statusFilter !== 'all') query.set('status', statusFilter);

      const [appsRes, jobsRes] = await Promise.all([
        api.get(`/applications/employer?${query.toString()}`),
        api.get('/jobs/employer/my-jobs?limit=50')
      ]);

      if (appsRes.data.success) {
        setApplications(appsRes.data.data.applications);
      }
      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data.jobs);
      }
    } catch (err) {
      error(err.message || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId, statusFilter]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus}`
      });

      if (res.data.success) {
        success(`Candidate status moved to ${newStatus}`);
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? res.data.data.application : a))
        );
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp(res.data.data.application);
        }
        setStatusNote('');
      }
    } catch (err) {
      error(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const backendStaticBase = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Pipeline & Applicants</h1>
          <p className="text-xs text-slate-500 mt-1">Review applicant profiles, view resumes, and advance candidates</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter by Job:</span>
        </div>

        <select
          value={jobId}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value) next.set('jobId', e.target.value);
            else next.delete('jobId');
            setSearchParams(next);
          }}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Job Postings</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title}
            </option>
          ))}
        </select>

        <span className="text-slate-300">|</span>

        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value !== 'all') next.set('status', e.target.value);
            else next.delete('status');
            setSearchParams(next);
          }}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">All Statuses</option>
          {validStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Applicants List Table */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading applicants...
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants found"
          description="No candidates have applied matching this filter criteria."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/70 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-4">Role Applied For</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Stage Status</th>
                  <th className="py-3.5 px-4">Quick Action</th>
                  <th className="py-3.5 px-6 text-right">Inspect Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {app.candidate?.name || 'Candidate Name'}
                      <span className="block text-xs font-normal text-slate-500">
                        {app.candidate?.email}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                      {app.job?.title || 'Job Title'}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      {/* Quick status updater dropdown */}
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        {validStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApp(app)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" /> Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Candidate Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Candidate Profile: ${selectedApp.candidate?.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Header / Contact */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedApp.candidate?.name}</h3>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {selectedApp.candidate?.email}
                  </span>
                  {selectedApp.candidate?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {selectedApp.candidate.phone}
                    </span>
                  )}
                  {selectedApp.candidate?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {selectedApp.candidate.location}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant={selectedApp.status}>{selectedApp.status}</Badge>
            </div>

            {/* Resume Link */}
            <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-brand-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedApp.resumeOriginalName || 'Candidate_Resume.pdf'}</p>
                  <p className="text-[11px] text-slate-500">Attached resume for this application</p>
                </div>
              </div>
              <a
                href={`${backendStaticBase}${selectedApp.resume}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                View Document <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Cover Letter */}
            {selectedApp.coverLetter && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Candidate Cover Letter / Note
                </h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed whitespace-pre-line">
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            {/* Candidate Skills */}
            {selectedApp.candidate?.candidateProfile?.skills?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Key Skills & Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.candidate.candidateProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status Transition Control */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Update Pipeline Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {validStatuses.map((st) => (
                  <button
                    key={st}
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(selectedApp._id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedApp.status === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedApp(null)}>
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}