import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full Time');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('USD');
  const [isSalaryNegotiable, setIsSalaryNegotiable] = useState(false);
  const [isRemote, setIsRemote] = useState(false);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [benefits, setBenefits] = useState('');
  const [status, setStatus] = useState('published');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, jobRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/jobs/${id}`)
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data.categories);
        }

        if (jobRes.data.success) {
          const job = jobRes.data.data.job;
          setTitle(job.title || '');
          setCategory(job.category?._id || job.category || '');
          setCompany(job.company || '');
          setLocation(job.location || '');
          setJobType(job.jobType || 'Full Time');
          setExperienceLevel(job.experienceLevel || 'Mid Level');
          setSalaryMin(job.salaryMin || '');
          setSalaryMax(job.salaryMax || '');
          setSalaryCurrency(job.salaryCurrency || 'USD');
          setIsSalaryNegotiable(!!job.isSalaryNegotiable);
          setIsRemote(!!job.isRemote);
          setDescription(job.description || '');
          setSkills(job.skills || []);
          setRequirements((job.requirements || []).join('\n'));
          setResponsibilities((job.responsibilities || []).join('\n'));
          setBenefits((job.benefits || []).join('\n'));
          setStatus(job.status || 'published');
        }
      } catch (err) {
        error(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (s) => {
    setSkills(skills.filter((item) => item !== s));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put(`/jobs/${id}`, {
        title,
        description,
        company,
        category,
        location,
        jobType,
        experienceLevel,
        salaryMin: Number(salaryMin) || 0,
        salaryMax: Number(salaryMax) || 0,
        salaryCurrency,
        isSalaryNegotiable,
        isRemote,
        skills,
        requirements: requirements.split('\n').filter(Boolean),
        responsibilities: responsibilities.split('\n').filter(Boolean),
        benefits: benefits.split('\n').filter(Boolean),
        status
      });

      if (res.data.success) {
        success('Job updated successfully');
        navigate('/employer/jobs');
      }
    } catch (err) {
      error(err.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
        Loading job editor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/employer/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Manage Jobs
      </Link>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Job Posting</h1>
        <p className="text-xs text-slate-500 mt-1">Update details, compensation, and requirements</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Core Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Job Type *
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Experience Level *
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <span>Remote position available</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Role Details</h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to="/employer/jobs">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="md" isLoading={saving} className="px-8 shadow-md shadow-brand-500/20">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}