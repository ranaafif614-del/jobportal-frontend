import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  User,
  Briefcase,
  Users,
  PlusCircle,
  ShieldAlert,
  Layers
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, role } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const candidateLinks = [
    { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', path: '/candidate/applications', icon: FileText },
    { name: 'Saved Jobs', path: '/candidate/saved-jobs', icon: Bookmark },
    { name: 'Profile & Resume', path: '/candidate/profile', icon: User },
  ];

  const employerLinks = [
    { name: 'Dashboard', path: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'Manage Jobs', path: '/employer/jobs', icon: Briefcase },
    { name: 'Post a Job', path: '/employer/jobs/new', icon: PlusCircle },
    { name: 'Candidate Applicants', path: '/employer/applicants', icon: Users },
    { name: 'Company Profile', path: '/employer/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Platform Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Job Moderation', path: '/admin/jobs', icon: Briefcase },
    { name: 'Job Categories', path: '/admin/categories', icon: Layers },
    { name: 'System Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
  ];

  let links = [];
  if (role === 'candidate') links = candidateLinks;
  else if (role === 'employer') links = employerLinks;
  else if (role === 'admin') links = adminLinks;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm sticky top-24">
              <div className="px-3 py-2 mb-3 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-base border border-brand-200">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h4>
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {user?.role}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content Area */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}