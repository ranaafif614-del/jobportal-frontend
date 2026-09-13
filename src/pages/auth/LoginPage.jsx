import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck, Building2, User } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      success(`Welcome back, ${user.name}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold text-2xl">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-slate-900">Career<span className="text-brand-600">Forge</span></span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500">Enter your credentials or click a one-tap demo account below</p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Quick Portfolio Demo Accounts:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@careerforge.com', 'Password123!')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-violet-400 hover:bg-violet-50 text-[11px] font-bold text-violet-700 transition-colors flex flex-col items-center gap-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('employer@nexuslabs.io', 'Password123!')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-[11px] font-bold text-indigo-700 transition-colors flex flex-col items-center gap-0.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Employer</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('candidate@careerforge.com', 'Password123!')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:bg-brand-50 text-[11px] font-bold text-brand-700 transition-colors flex flex-col items-center gap-0.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidate</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-2 shadow-md shadow-brand-500/20">
              Sign In to CareerForge
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}