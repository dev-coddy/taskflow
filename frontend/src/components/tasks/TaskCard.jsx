import React from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { UserAvatar } from '../common/UserAvatar';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { FiCalendar, FiClock, FiEdit2, FiTrash2, FiPlusCircle, FiAlertTriangle } from 'react-icons/fi';

export const TaskCard = ({
  task,
  onLogUpdate,
  onEdit,
  onDelete,
  isManager = false
}) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className={`group rounded-lg border bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 w-full ${
        overdue
          ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Left Column: Title, Description, Badges */}
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.timeSpent > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              <FiClock className="w-3 h-3 text-blue-500" /> {task.timeSpent} hrs
            </span>
          )}
          {overdue && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
              <FiAlertTriangle className="w-3 h-3" /> Overdue
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Right Column: Assignee, Due Date, Actions */}
      <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
        {/* Assignee Avatar */}
        <div className="flex items-center gap-2 min-w-[130px]">
          <UserAvatar name={task.assignedTo?.name || 'Unassigned'} role={task.assignedTo?.role} size="sm" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        </div>

        {/* Due Date */}
        <div className={`flex items-center gap-1 text-xs font-medium min-w-[100px] ${overdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
          <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onLogUpdate && task.status !== 'Completed' && (
            <button
              onClick={() => onLogUpdate(task)}
              className="p-1.5 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Log Daily Status Update"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Log Update</span>
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && isManager && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Delete Task"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
