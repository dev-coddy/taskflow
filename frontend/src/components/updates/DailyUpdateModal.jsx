import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { STATUS_OPTIONS } from '../../utils/constants';
import dayjs from 'dayjs';

export const DailyUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  loading = false
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (isOpen && task) {
      reset({
        taskId: task._id,
        status: task.status || 'In Progress',
        date: dayjs().format('YYYY-MM-DD'),
        hoursWorked: 4,
        remarks: ''
      });
    }
  }, [isOpen, task?._id]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Daily Update"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Task Briefing */}
        <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Selected Task
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{task.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Date *
            </label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Update */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Updated Status *
            </label>
            <select
              {...register('status', { required: true })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hours Worked */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Hours Worked Today
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="24"
            {...register('hoursWorked')}
            placeholder="e.g. 6.5"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Remarks / Log entry */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Progress Remarks *
          </label>
          <textarea
            rows="3"
            {...register('remarks', { required: true })}
            placeholder="Specify what you completed today, blockers encountered, or next steps..."
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Submit Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
