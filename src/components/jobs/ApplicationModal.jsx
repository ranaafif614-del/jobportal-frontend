import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function ApplicationModal({ isOpen, onClose, job, onSuccess }) {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [coverLetter, setCoverLetter] = useState('');
  const [useProfileResume, setUseProfileResume] = useState(
    !!user?.candidateProfile?.resume
  );
  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!job) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['.pdf', '.doc', '.docx'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!validTypes.includes(ext)) {
        setErrorMessage('Only PDF, DOC, and DOCX files are supported');
        return;
      }
      setErrorMessage('');
      setUploadedResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    let finalResume = user?.candidateProfile?.resume || '';
    let finalResumeName = user?.candidateProfile?.resumeOriginalName || 'Resume.pdf';

    try {
      setSubmitting(true);

      // If candidate wants to upload a fresh file
      if (!useProfileResume || !finalResume) {
        if (!uploadedResumeFile) {
          setErrorMessage('Please upload a resume file (PDF or DOC) to apply');
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('resume', uploadedResumeFile);

        const uploadRes = await api.post('/users/resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (uploadRes.data.success) {
          finalResume = uploadRes.data.data.resume;
          finalResumeName = uploadRes.data.data.resumeOriginalName;
          updateUser(uploadRes.data.data.user);
        }
      }

      // Submit application
      const res = await api.post('/applications', {
        jobId: job._id,
        coverLetter,
        resume: finalResume,
        resumeOriginalName: finalResumeName
      });

      if (res.data.success) {
        success('Your application has been submitted successfully!');
        if (onSuccess) onSuccess(res.data.data.application);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application');
      error(err.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${job.company}`} maxWidth="max-w-xl">
      <div className="mb-4 pb-4 border-b border-slate-100">
        <h4 className="font-bold text-base text-slate-900">{job.title}</h4>
        <p className="text-xs text-slate-500">{job.location} • {job.jobType}</p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resume Option */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Resume / CV
          </label>

          {user?.candidateProfile?.resume ? (
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="resumeOption"
                  checked={useProfileResume}
                  onChange={() => setUseProfileResume(true)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <FileText className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-medium text-slate-700 truncate">
                  Use Profile Resume ({user.candidateProfile.resumeOriginalName || 'Resume.pdf'})
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="resumeOption"
                  checked={!useProfileResume}
                  onChange={() => setUseProfileResume(false)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <Upload className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-700">Upload a new resume file</span>
              </label>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mb-2">You have not uploaded a resume to your profile yet. Please upload one below:</p>
          )}

          {(!useProfileResume || !user?.candidateProfile?.resume) && (
            <div className="mt-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-white">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {uploadedResumeFile ? uploadedResumeFile.name : 'Click to upload PDF or DOC (Max 5MB)'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Cover Letter / Note to Hiring Manager (Optional)
          </label>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Explain why your experience is a great fit for this position..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={submitting}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}