import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building2, Bookmark, BookmarkCheck } from 'lucide-react';
import Badge from '../common/Badge';
import { formatSalary, formatRelativeTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function JobCard({ job, isBookmarked = false, onBookmarkToggle }) {
  const { user, isAuthenticated, role } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(isBookmarked);
  const [saving, setSaving] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (role !== 'candidate') {
      error('Only candidate accounts can bookmark jobs');
      return;
    }

    try {
      setSaving(true);
      if (saved) {
        await api.delete(`/saved-jobs/${job._id}`);
        setSaved(false);
        success('Job removed from bookmarks');
        if (onBookmarkToggle) onBookmarkToggle(job._id, false);
      } else {
        await api.post(`/saved-jobs/${job._id}`);
        setSaved(true);
        success('Job added to bookmarks');
        if (onBookmarkToggle) onBookmarkToggle(job._id, true);
      }
    } catch (err) {
      error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold overflow-hidden flex-shrink-0">
              {job.employer?.employerProfile?.companyLogo ? (
                <img
                  src={job.employer.employerProfile.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <Link
                to={`/jobs/${job.slug || job._id}`}
                className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="text-sm font-medium text-slate-500">{job.company}</p>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            disabled={saving}
            title={saved ? 'Remove bookmark' : 'Bookmark job'}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
          >
            {saved ? (
              <BookmarkCheck className="w-5 h-5 text-brand-600 fill-brand-600" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={job.jobType}>{job.jobType}</Badge>
          {job.isRemote && <Badge variant="Remote">Remote</Badge>}
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {job.experienceLevel}
          </span>
          {job.category?.name && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {job.category.name}
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Skills preview */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 text-slate-400">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-800 text-sm">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.isSalaryNegotiable)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
        </div>
        <span className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {formatRelativeTime(job.createdAt)}
        </span>
      </div>
    </div>
  );
}