import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  FileText,
  PlusCircle,
  ShieldAlert,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="tracking-tight text-xl font-extrabold text-slate-900">
              Career<span className="text-brand-600">Forge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/jobs"
              className={`text-sm font-semibold transition-colors ${
                isActive('/jobs') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Browse Jobs
            </Link>

            {isAuthenticated && role === 'candidate' && (
              <>
                <Link
                  to="/candidate/dashboard"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/candidate/dashboard') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/candidate/applications"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/candidate/applications') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Applications
                </Link>
                <Link
                  to="/candidate/saved-jobs"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/candidate/saved-jobs') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Saved Jobs
                </Link>
              </>
            )}

            {isAuthenticated && role === 'employer' && (
              <>
                <Link
                  to="/employer/dashboard"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/employer/dashboard') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/employer/jobs"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/employer/jobs') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Manage Jobs
                </Link>
                <Link
                  to="/employer/applicants"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/employer/applicants') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Applicants
                </Link>
              </>
            )}

            {isAuthenticated && role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/admin/dashboard') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin Overview
                </Link>
                <Link
                  to="/admin/users"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/admin/users') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/jobs"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/admin/jobs') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  to="/admin/categories"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/admin/categories') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Categories
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
                >
                  Sign Up
                </Link>
                <Link
                  to="/register?role=employer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Post a Job
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {role === 'employer' && (
                  <Link
                    to="/employer/jobs/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/20 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Job
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm border border-brand-200">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                      </div>

                      {role === 'candidate' && (
                        <>
                          <Link
                            to="/candidate/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                          </Link>
                          <Link
                            to="/candidate/profile"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-slate-400" /> My Profile & Resume
                          </Link>
                          <Link
                            to="/candidate/applications"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <FileText className="w-4 h-4 text-slate-400" /> My Applications
                          </Link>
                          <Link
                            to="/candidate/saved-jobs"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Bookmark className="w-4 h-4 text-slate-400" /> Saved Jobs
                          </Link>
                        </>
                      )}

                      {role === 'employer' && (
                        <>
                          <Link
                            to="/employer/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                          </Link>
                          <Link
                            to="/employer/profile"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-slate-400" /> Company Profile
                          </Link>
                          <Link
                            to="/employer/jobs"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" /> Manage Postings
                          </Link>
                        </>
                      )}

                      {role === 'admin' && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <ShieldAlert className="w-4 h-4 text-slate-400" /> Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/audit-logs"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <FileText className="w-4 h-4 text-slate-400" /> Audit Logs
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}