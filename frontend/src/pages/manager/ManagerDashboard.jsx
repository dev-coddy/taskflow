import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/reportService';
import { MetricCard, Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/Badge';
import { UserAvatar } from '../../components/common/UserAvatar';
import { formatDate } from '../../utils/dateUtils';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import {
  FiUsers,
  FiCheckSquare,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiMail,
  FiPlus
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading && !stats) {
    return <Spinner size="lg" className="py-20" />;
  }

  const cards = stats?.cards || {};
  const recentUpdates = (stats?.recentUpdates || []).filter((upd) =>
    !globalSearch ||
    upd.employeeId?.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
    upd.taskId?.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
    upd.remarks.toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 rounded-lg p-5 text-white border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">Manager Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of team members, tasks, and daily status reports.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            icon={FiMail}
            onClick={() => navigate('/email-generator')}
            className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
          >
            Email Generator
          </Button>

          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => navigate('/tasks')}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Team Members"
          value={cards.totalEmployees || 0}
          icon={FiUsers}
          color="purple"
        />
        <MetricCard
          title="Total Tasks"
          value={cards.totalTasks || 0}
          icon={FiCheckSquare}
          color="blue"
        />
        <MetricCard
          title="Completed Tasks"
          value={cards.completedTasks || 0}
          icon={FiCheckCircle}
          trend={`${cards.completionPercentage || 0}% Completed`}
          color="emerald"
        />
        <MetricCard
          title="Pending Tasks"
          value={cards.pendingTasks || 0}
          icon={FiClock}
          color="amber"
        />
        <MetricCard
          title="Blocked Tasks"
          value={cards.blockedTasks || 0}
          icon={FiAlertCircle}
          color="rose"
        />
      </div>

      {/* Recent Team Updates List */}
      <Card
        title="Recent Daily Updates"
        subtitle="Latest status updates submitted by team members"
        action={
          <Button size="sm" variant="outline" onClick={() => navigate('/reports')}>
            View Reports
          </Button>
        }
      >
        {recentUpdates.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            No daily updates logged today yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentUpdates.map((upd) => (
              <div
                key={upd._id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={upd.employeeId?.name || 'Employee'}
                    role={upd.employeeId?.role}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {upd.employeeId?.name || 'Employee'}
                      </h4>
                      <span className="text-[11px] text-slate-400">• {upd.employeeId?.department || 'Engineering'}</span>
                    </div>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                      {upd.taskId?.title || 'General Task'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      "{upd.remarks}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {upd.hoursWorked > 0 && (
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {upd.hoursWorked} hrs
                    </span>
                  )}
                  <StatusBadge status={upd.status} />
                  <span className="text-xs text-slate-400">
                    {formatDate(upd.createdAt || upd.date, 'MMM D, h:mm A')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
