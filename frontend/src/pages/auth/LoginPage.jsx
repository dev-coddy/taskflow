import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Button } from '../../components/common/Button';
import { seedDemoData } from '../../services/authService';
import toast from 'react-hot-toast';
import { FiLayers, FiLock, FiMail, FiArrowRight, FiRefreshCw, FiUserCheck } from 'react-icons/fi';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
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

  const handleFillManager = () => {
    setEmail('manager@taskflow.com');
    setPassword('Password123!');
  };

  const handleFillEmployee = () => {
    setEmail('alex@taskflow.com');
    setPassword('Password123!');
  };

  const handleResetData = async () => {
    setSeeding(true);
    try {
      await seedDemoData();
      toast.success('Database restored! Default Manager & Employee accounts created.');
      setEmail('manager@taskflow.com');
      setPassword('Password123!');
    } catch (err) {
      toast.error('Failed to reset demo database: ' + (err.response?.data?.message || err.message));
    } finally {
      setSeeding(false);
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

          {/* Quick Demo Credentials Presets */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Preset Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleFillManager}
                className="px-3 py-2 text-xs font-medium rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <FiUserCheck className="w-3.5 h-3.5" />
                Fill Manager
              </button>
              <button
                type="button"
                onClick={handleFillEmployee}
                className="px-3 py-2 text-xs font-medium rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <FiUserCheck className="w-3.5 h-3.5" />
                Fill Employee
              </button>
            </div>

            {/* Restore/Re-seed Demo Data */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetData}
                disabled={seeding}
                className="w-full px-3 py-2 text-xs font-medium rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                {seeding ? 'Restoring Accounts...' : 'Restore Default Accounts & Seed Data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

