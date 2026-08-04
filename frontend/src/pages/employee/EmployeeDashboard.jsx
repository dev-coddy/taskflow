import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/reportService';
import { createDailyUpdate } from '../../services/updateService';
import { MetricCard } from '../../components/common/Card';
import { TaskCard } from '../../components/tasks/TaskCard';
import { DailyUpdateModal } from '../../components/updates/DailyUpdateModal';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/dateUtils';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { FiCheckSquare, FiCheckCircle, FiAlertCircle, FiClock, FiList, FiPlusCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState(null);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const { globalSearch } = useOutletContext() || {};
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateSubmit = async (formData) => {
    try {
      setSubmittingUpdate(true);
      await createDailyUpdate(formData);
      toast.success('Daily update logged');
      setSelectedTaskForUpdate(null);
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit update');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  if (loading && !stats) {
    return <Spinner size="lg" className="py-20" />;
  }

  const cards = stats?.cards || {};
  const recentTasks = (stats?.recentTasks || []).filter((task) => {
    if (!globalSearch || !globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      task.title?.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q) ||
      task.status?.toLowerCase().includes(q)
    );
  });
  const todayUpdates = stats?.todayUpdates || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 rounded-lg p-5 text-white border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">Employee Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your assigned tasks and log daily status reports.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/my-tasks')}
          className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
        >
          View All Tasks
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assigned Tasks"
          value={cards.assigned || 0}
          icon={FiCheckSquare}
          color="blue"
        />
        <MetricCard
          title="Completed"
          value={cards.completed || 0}
          icon={FiCheckCircle}
          color="emerald"
        />
        <MetricCard
          title="Pending"
          value={cards.pending || 0}
          icon={FiClock}
          color="amber"
        />
        <MetricCard
          title="Blocked"
          value={cards.blocked || 0}
          icon={FiAlertCircle}
          color="rose"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned Tasks listed horizontally downwards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiList className="w-4 h-4 text-blue-600" /> Assigned Tasks
          </h3>

          {recentTasks.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">No tasks assigned right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onLogUpdate={(t) => setSelectedTaskForUpdate(t)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Today's Logged Updates */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiClock className="w-4 h-4 text-emerald-600" /> Today's Logged Updates
          </h3>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
            {todayUpdates.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  No daily updates logged today yet.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  icon={FiPlusCircle}
                  onClick={() => {
                    if (recentTasks.length > 0) {
                      setSelectedTaskForUpdate(recentTasks[0]);
                    } else {
                      navigate('/my-tasks');
                    }
                  }}
                >
                  Log Daily Update
                </Button>
              </div>
            ) : (
              todayUpdates.map((update) => (
                <div
                  key={update._id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                      {update.taskId?.title || 'Task Update'}
                    </span>
                    <StatusBadge status={update.status} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    "{update.remarks}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span>Hours: {update.hoursWorked || 0} hrs</span>
                    <span>{formatDate(update.date, 'h:mm A')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <DailyUpdateModal
        isOpen={Boolean(selectedTaskForUpdate)}
        onClose={() => setSelectedTaskForUpdate(null)}
        task={selectedTaskForUpdate}
        onSubmit={handleUpdateSubmit}
        loading={submittingUpdate}
      />
    </div>
  );
};
