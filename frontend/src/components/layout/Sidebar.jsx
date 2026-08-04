import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiMail,
  FiClock,
  FiUser,
  FiLogOut,
  FiLayers
} from 'react-icons/fi';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const isManager = user?.role === 'Manager';

  const defaultDashboard = isManager ? '/dashboard/manager' : '/dashboard/employee';

  const managerLinks = [
    { label: 'Dashboard', path: '/dashboard/manager', icon: FiGrid },
    { label: 'Team Members', path: '/employees', icon: FiUsers },
    { label: 'Tasks', path: '/tasks', icon: FiCheckSquare },
    { label: 'Reports', path: '/reports', icon: FiBarChart2 },
    { label: 'Email Generator', path: '/email-generator', icon: FiMail },
    { label: 'Profile & Settings', path: '/profile', icon: FiUser }
  ];

  const employeeLinks = [
    { label: 'Dashboard', path: '/dashboard/employee', icon: FiGrid },
    { label: 'My Tasks', path: '/my-tasks', icon: FiCheckSquare },
    { label: 'History', path: '/history', icon: FiClock },
    { label: 'Profile & Settings', path: '/profile', icon: FiUser }
  ];

  const links = isManager ? managerLinks : employeeLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo Header (Clickable Link to Dashboard) */}
          <Link
            to={defaultDashboard}
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <FiLayers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white">
                TaskFlow
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                {user?.role || 'User'} Portal
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
