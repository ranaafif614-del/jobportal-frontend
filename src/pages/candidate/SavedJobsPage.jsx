import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import JobCard from '../../components/jobs/JobCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await api.get('/saved-jobs');
      if (res.data.success) {
        setSavedJobs(res.data.data.savedJobs);
      }
    } catch (err) {
      console.error('Failed to load saved jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleBookmarkToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Opportunities</h1>
          <p className="text-xs text-slate-500 mt-1">Bookmarked jobs you are interested in applying to later</p>
        </div>
        <Link to="/jobs">
          <Button size="sm">Browse More Jobs</Button>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading saved jobs...
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked jobs yet"
          description="Click the bookmark ribbon on any job card to save it for quick review and one-click applying."
          actionText="Explore Active Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((item) => (
            <JobCard
              key={item._id}
              job={item.job}
              isBookmarked={true}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}