import React from 'react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { FiMenu, FiSearch } from 'react-icons/fi';

export const Navbar = ({ onMenuToggle, searchValue, onSearchChange }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchValue || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search tasks, employees, reports..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* User Profile Pill in Navbar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <UserAvatar name={user?.name || 'User'} role={user?.role} size="md" />
          <div className="hidden sm:block">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</h5>
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
