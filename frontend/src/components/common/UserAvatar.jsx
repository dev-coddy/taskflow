import React from 'react';

const COLOR_CLASSES = [
  'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
  'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
];

export const UserAvatar = ({ name = 'User', role = '', size = 'md', className = '' }) => {
  // Extract initials (e.g. "John Doe" -> "JD")
  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // Pick color deterministic based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % COLOR_CLASSES.length;
  const colorClass = COLOR_CLASSES[colorIndex];

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-md',
    md: 'w-9 h-9 text-sm rounded-lg',
    lg: 'w-12 h-12 text-base rounded-lg',
    xl: 'w-16 h-16 text-xl rounded-xl'
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-bold border ${sizeClasses[size] || sizeClasses.md} ${colorClass} ${className}`}
      title={`${name}${role ? ` (${role})` : ''}`}
    >
      {initials}
    </div>
  );
};
