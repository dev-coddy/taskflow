import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Button } from '../../components/common/Button';
import { FiLayers, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'Manager') {
        navigate('/dashboard/manager', { replace: true });
      } else {
        navigate('/dashboard/employee', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const loggedInUser = await loginUser({ email, password });
      if (loggedInUser.role === 'Manager') {
        navigate('/dashboard/manager');
      } else {
        navigate('/dashboard/employee');
      }
    } catch (error) {
      // Error toast handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 shadow-md text-white mb-3">
            <FiLayers className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            TaskFlow
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Task & Daily Status Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-1">Sign In</h2>
          <p className="text-xs text-slate-400 mb-5">
            Enter your email address and password to log in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@taskflow.com"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
              icon={FiArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials Quick-Fill */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Demo Accounts (Click to Quick-Fill)</span>
              <span className="text-[10px] text-blue-400 font-mono bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">Pass: Password123!</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@taskflow.com');
                  setPassword('Password123!');
                }}
                className="p-2 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                  <span>👔 Manager</span>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-blue-400">Fill →</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">manager@taskflow.com</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('alex@taskflow.com');
                  setPassword('Password123!');
                }}
                className="p-2 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                  <span>👤 Employee</span>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-blue-400">Fill →</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">alex@taskflow.com</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
