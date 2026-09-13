import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  ArrowRight,
  Code,
  Globe,
  Smartphone,
  Cpu,
  BarChart2,
  Cloud,
  Shield,
  Layout,
  Compass,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import SearchBar from '../../components/jobs/SearchBar';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import api from '../../services/api';

const categoryIconMap = {
  Code,
  Globe,
  Smartphone,
  Cpu,
  BarChart2,
  Cloud,
  Shield,
  Layout,
  Compass,
  CheckCircle,
  DollarSign,
  Users,
  Briefcase
};

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsRes, catRes] = await Promise.all([
          api.get('/jobs?limit=6&sort=latest'),
          api.get('/categories')
        ]);

        if (jobsRes.data.success) {
          setFeaturedJobs(jobsRes.data.data.jobs);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data.categories);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = ({ keyword, location }) => {
    const params = new URLSearchParams();
    if (keyword) params.set('search', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-700 text-xs font-bold uppercase tracking-wider border border-brand-200 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-brand-600" />
              <span>Next-Generation Career Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Find Your Dream Role with <span className="text-brand-600">CareerForge</span>
            </h1>

            <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Connecting elite software engineers, designers, and innovators with high-impact tech companies. Zero fluff. Direct hiring.
            </p>

            {/* Search Bar */}
            <div className="pt-4 max-w-4xl mx-auto">
              <SearchBar onSearch={handleHeroSearch} />
            </div>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Trending Searches:</span>
              {['React', 'Node.js', 'Machine Learning', 'Remote', 'DevOps', 'UI/UX'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-colors shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats ticker */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-slate-900">5,000+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Active Jobs</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-brand-600">1,200+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Tech Companies</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-slate-900">98%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Verified Employers</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-indigo-600">24h</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Avg Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Browse opportunities across popular domains in technology</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2 md:mt-0"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => {
            const IconComponent = categoryIconMap[cat.icon] || Briefcase;
            return (
              <Link
                key={cat._id}
                to={`/jobs?category=${cat._id}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.jobCount || 0} open roles</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Positions</h2>
            <p className="text-sm text-slate-500 mt-1">Hand-picked openings from verified top employers</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2 md:mt-0"
          >
            Explore all {featuredJobs.length}+ positions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Why Choose CareerForge</h2>
            <p className="text-slate-400 text-sm mt-2">
              Designed from the ground up for transparent, secure, and rapid tech hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verified Companies</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every employer is screened and authenticated to ensure legitimate vacancies and fair hiring policies.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track your application pipeline with live status updates: Under Review, Shortlisted, Interview, and Hired.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">One-Click Applying</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Save your resume and applied portfolio once, then apply for exciting opportunities in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hiring Elite Developers & Designers?
            </h3>
            <p className="text-brand-100 text-sm leading-relaxed">
              Post your job openings on CareerForge and tap into our rapidly growing network of qualified tech professionals today.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/register?role=employer">
              <Button variant="secondary" size="lg" className="bg-white text-brand-900 hover:bg-slate-100">
                Post a Job Opening
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}