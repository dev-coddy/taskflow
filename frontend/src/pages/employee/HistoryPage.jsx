import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getDailyUpdates, deleteDailyUpdate } from '../../services/updateService';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/dateUtils';
import { Spinner } from '../../components/common/Spinner';
import { FiCalendar, FiTrash2, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const HistoryPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  const { globalSearch } = useOutletContext() || {};

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await getDailyUpdates({
        date: dateFilter || undefined
      });
      setUpdates(res.data || []);
    } catch (error) {
      toast.error('Failed to load update history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [dateFilter]);

  const displayedUpdates = updates.filter((upd) => {
    if (!globalSearch || !globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      upd.taskId?.title?.toLowerCase().includes(q) ||
      upd.remarks?.toLowerCase().includes(q) ||
      upd.status?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update log?')) return;
    try {
      await deleteDailyUpdate(id);
      toast.success('Update log deleted');
      fetchUpdates();
    } catch (error) {
      toast.error('Failed to delete update log');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Update History</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            History of your submitted daily progress updates.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-lg">
          <FiCalendar className="w-4 h-4 text-blue-600 ml-1" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs border-0 bg-transparent text-slate-900 dark:text-white focus:outline-none"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-rose-500 font-bold px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* History Log List */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : displayedUpdates.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <FiFileText className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-xs text-slate-500">No update logs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedUpdates.map((upd) => (
            <div
              key={upd._id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5 text-blue-500" />
                    {formatDate(upd.date, 'MMMM D, YYYY')}
                  </span>
                  <StatusBadge status={upd.status} />
                  {upd.hoursWorked > 0 && (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {upd.hoursWorked} hrs
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {upd.taskId?.title || 'General Task'}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                  "{upd.remarks}"
                </p>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  Logged {formatDate(upd.createdAt, 'h:mm A')}
                </span>
                <button
                  onClick={() => handleDelete(upd._id)}
                  className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  title="Delete Log Entry"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
