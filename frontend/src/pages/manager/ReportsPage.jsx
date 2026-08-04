import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getDailyUpdates } from '../../services/updateService';
import { getTasks } from '../../services/taskService';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { UserAvatar } from '../../components/common/UserAvatar';
import { formatDate } from '../../utils/dateUtils';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { FiDownload, FiCalendar } from 'react-icons/fi';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export const ReportsPage = () => {
  const [updates, setUpdates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('updates');
  const [dateFilter, setDateFilter] = useState('');

  const { globalSearch } = useOutletContext() || {};

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const [updRes, taskRes] = await Promise.all([
          getDailyUpdates(),
          getTasks()
        ]);
        setUpdates(updRes.data || []);
        setTasks(taskRes.data || []);
      } catch (error) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const displayedUpdates = updates.filter((u) => {
    if (dateFilter) {
      const updateDateStr = dayjs(u.date).format('YYYY-MM-DD');
      if (updateDateStr !== dateFilter) return false;
    }
    if (!globalSearch || !globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      u.employeeId?.name?.toLowerCase().includes(q) ||
      u.taskId?.title?.toLowerCase().includes(q) ||
      u.remarks?.toLowerCase().includes(q) ||
      u.status?.toLowerCase().includes(q)
    );
  });

  const displayedTasks = tasks.filter((t) => {
    if (dateFilter) {
      const dueDateStr = dayjs(t.dueDate).format('YYYY-MM-DD');
      const createdAtStr = dayjs(t.createdAt).format('YYYY-MM-DD');
      if (dueDateStr !== dateFilter && createdAtStr !== dateFilter) return false;
    }
    if (!globalSearch || !globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.assignedTo?.name?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q) ||
      t.priority?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'updates') {
      csvContent += 'Date,Employee,Department,Task Title,Status,Hours Worked,Remarks\n';
      displayedUpdates.forEach((u) => {
        const row = [
          `"${formatDate(u.date)}"`,
          `"${u.employeeId?.name || 'Unknown'}"`,
          `"${u.employeeId?.department || 'N/A'}"`,
          `"${u.taskId?.title || 'General'}"`,
          `"${u.status}"`,
          `"${u.hoursWorked || 0}"`,
          `"${(u.remarks || '').replace(/"/g, '""')}"`
        ].join(',');
        csvContent += row + '\n';
      });
    } else {
      csvContent += 'Title,Assigned To,Priority,Status,Due Date,Created At\n';
      displayedTasks.forEach((t) => {
        const row = [
          `"${t.title}"`,
          `"${t.assignedTo?.name || 'Unassigned'}"`,
          `"${t.priority}"`,
          `"${t.status}"`,
          `"${formatDate(t.dueDate)}"`,
          `"${formatDate(t.createdAt)}"`
        ].join(',');
        csvContent += row + '\n';
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TaskFlow_${activeTab}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${activeTab} report as CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reports</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export and inspect daily update logs and task inventories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
            <FiCalendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">Filter Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs border-0 bg-transparent text-slate-900 dark:text-white focus:outline-none"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-xs text-rose-500 font-bold hover:underline ml-1"
              >
                Clear
              </button>
            )}
          </div>

          <Button
            variant="primary"
            icon={FiDownload}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('updates')}
          className={`px-4 py-2 text-xs font-semibold transition-all border-b-2 ${
            activeTab === 'updates'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Daily Updates ({displayedUpdates.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-xs font-semibold transition-all border-b-2 ${
            activeTab === 'tasks'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Tasks Inventory ({displayedTasks.length})
        </button>
      </div>

      {/* Content Table */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : activeTab === 'updates' ? (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {displayedUpdates.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatDate(u.date, 'MMM D, YYYY')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={u.employeeId?.name || 'Employee'} role={u.employeeId?.role} size="sm" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{u.employeeId?.name || 'Employee'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-600 dark:text-blue-400">
                      {u.taskId?.title || 'General Task'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {u.hoursWorked || 0} hrs
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {u.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {displayedTasks.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {t.title}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={t.assignedTo?.name || 'Unassigned'} role={t.assignedTo?.role} size="sm" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{t.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-500">
                      {formatDate(t.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
