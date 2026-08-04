export const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed', 'Blocked'];
export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export const STATUS_COLORS = {
  'Not Started': {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-500'
  },
  'In Progress': {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500'
  },
  'Completed': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500'
  },
  'Blocked': {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500'
  }
};

export const PRIORITY_COLORS = {
  Low: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'border-emerald-300 dark:border-emerald-800'
  },
  Medium: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'border-blue-300 dark:border-blue-800'
  },
  High: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'border-amber-300 dark:border-amber-800'
  },
  Critical: {
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'border-rose-400 dark:border-rose-700'
  }
};
