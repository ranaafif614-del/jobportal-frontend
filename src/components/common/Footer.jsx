import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-xl">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="tracking-tight text-xl font-extrabold text-white">
                Career<span className="text-brand-400">Forge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering engineers and top tech companies to connect, grow, and build future-defining careers.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Candidates</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse All Jobs</Link></li>
              <li><Link to="/jobs?isRemote=true" className="hover:text-white transition-colors">Remote Positions</Link></li>
              <li><Link to="/candidate/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
              <li><Link to="/candidate/saved-jobs" className="hover:text-white transition-colors">Saved Opportunities</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Employers</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/register?role=employer" className="hover:text-white transition-colors">Post a Job Opening</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
              <li><Link to="/employer/applicants" className="hover:text-white transition-colors">Candidate Pipeline</Link></li>
              <li><Link to="/employer/jobs" className="hover:text-white transition-colors">Manage Postings</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="text-emerald-400 font-semibold text-xs">● Live REST API</span></li>
              <li><span className="text-slate-400 text-xs">Role-Based Access Control</span></li>
              <li><span className="text-slate-400 text-xs">MongoDB Atlas Cloud</span></li>
              <li><Link to="/admin/dashboard" className="hover:text-white text-xs transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerForge Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for engineers & teams.
          </p>
        </div>
      </div>
    </footer>
  );
}