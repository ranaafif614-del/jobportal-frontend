import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  ExternalLink,
  Share2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ApplicationModal from '../../components/jobs/ApplicationModal';
import { formatSalary, formatDate, formatRelativeTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();
  const { success, error } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          const foundJob = res.data.data.job;
          setJob(foundJob);

          // If logged in candidate, check bookmark status and application status
          if (isAuthenticated && role === 'candidate') {
            try {
              const [savedRes, myAppsRes] = await Promise.all([
                api.get(`/saved-jobs/check/${foundJob._id}`),
                api.get('/applications/my')
              ]);

              if (savedRes.data.success) {
                setIsSaved(savedRes.data.data.isSaved);
              }
              if (myAppsRes.data.success) {
                const matched = myAppsRes.data.data.applications.find(
                  (a) => a.job?._id === foundJob._id
                );
                if (matched) setExistingApplication(matched);
              }
            } catch (innerErr) {
              // Non-fatal
            }
          }
        }
      } catch (err) {
        error(err.message || 'Job not found');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, isAuthenticated, role]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'candidate') {
      error('Only candidate accounts can bookmark jobs');
      return;
    }

    try {
      setSavingBookmark(true);
      if (isSaved) {
        await api.delete(`/saved-jobs/${job._id}`);
        setIsSaved(false);
        success('Removed from bookmarks');
      } else {
        await api.post(`/saved-jobs/${job._id}`);
        setIsSaved(true);
        success('Added to bookmarks');
      }
    } catch (err) {
      error(err.message);
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'candidate') {
      error('Employers and administrators cannot apply to jobs. Please sign in as a Candidate.');
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Job Posting Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested position may have been closed or removed.</p>
        <Link to="/jobs">
          <Button variant="primary">Browse Other Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Listings
      </Link>

      {/* Applied Banner if Candidate Already Applied */}
      {existingApplication && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-indigo-900">
                You applied for this job on {formatDate(existingApplication.createdAt)}
              </p>
              <p className="text-xs text-indigo-700">
                Current Application Status: <span className="font-semibold">{existingApplication.status}</span>
              </p>
            </div>
          </div>
          <Link to="/candidate/applications">
            <Button size="sm" variant="outline" className="bg-white">
              View Application
            </Button>
          </Link>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold overflow-hidden flex-shrink-0">
              {job.employer?.employerProfile?.companyLogo ? (
                <img
                  src={job.employer.employerProfile.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <p className="text-base font-semibold text-slate-600 mt-1">{job.company}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleBookmarkToggle}
              disabled={savingBookmark}
              className="p-3 rounded-xl border border-slate-200 hover:border-brand-300 text-slate-600 hover:text-brand-600 transition-colors shadow-sm"
              title={isSaved ? 'Remove Bookmark' : 'Bookmark this job'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-brand-600 fill-brand-600" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            {existingApplication ? (
              <Button disabled variant="outline" size="md" className="cursor-not-allowed">
                Applied ({existingApplication.status})
              </Button>
            ) : (
              <Button onClick={handleApplyClick} size="md" className="px-8 shadow-md shadow-brand-500/20">
                Apply for Position
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{job.location} {job.isRemote && '(Remote)'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.isSalaryNegotiable)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span>{job.jobType} • {job.experienceLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Posted {formatRelativeTime(job.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Grid: Description & Company Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Job Details */}
        <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {/* About Role */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">About the Role</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications & Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Qualifications & Skills</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Perks & Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {job.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Skills Chips */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Technologies & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 col: Company Info & Apply Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">About {job.company}</h3>

            {job.employer?.employerProfile?.companyDescription ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                {job.employer.employerProfile.companyDescription}
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Innovative technology company building next-generation products.
              </p>
            )}

            <div className="space-y-2.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
              {job.employer?.employerProfile?.industry && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Industry</span>
                  <span className="font-semibold text-slate-900">{job.employer.employerProfile.industry}</span>
                </div>
              )}
              {job.employer?.employerProfile?.companySize && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Company Size</span>
                  <span className="font-semibold text-slate-900">{job.employer.employerProfile.companySize} employees</span>
                </div>
              )}
              {job.employer?.employerProfile?.website && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Website</span>
                  <a
                    href={job.employer.employerProfile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4">
              {existingApplication ? (
                <Button disabled variant="outline" className="w-full">
                  Application Submitted
                </Button>
              ) : (
                <Button onClick={handleApplyClick} className="w-full shadow-md shadow-brand-500/20">
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
        onSuccess={(app) => setExistingApplication(app)}
      />
    </div>
  );
}