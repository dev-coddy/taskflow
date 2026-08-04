import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getTasks, createTask, updateTask } from '../../services/taskService';
import { createDailyUpdate } from '../../services/updateService';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskModal } from '../../components/tasks/TaskModal';
import { DailyUpdateModal } from '../../components/updates/DailyUpdateModal';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/constants';
import { FiPlus, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState(null);
  const [savingTask, setSavingTask] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const { globalSearch } = useOutletContext() || {};

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined
      });
      setTasks(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  // Live filter tasks using Navbar search query
  const displayedTasks = tasks.filter((task) => {
    if (!globalSearch || !globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      task.title?.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q) ||
      task.status?.toLowerCase().includes(q) ||
      task.priority?.toLowerCase().includes(q) ||
      task.assignedTo?.name?.toLowerCase().includes(q)
    );
  });

  const handleTaskSubmit = async (formData) => {
    try {
      setSavingTask(true);
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        toast.success('Task updated');
      } else {
        await createTask(formData);
        toast.success('Task created');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving task');
    } finally {
      setSavingTask(false);
    }
  };

  const handleUpdateSubmit = async (updateData) => {
    try {
      setSavingUpdate(true);
      await createDailyUpdate(updateData);
      toast.success('Daily update logged');
      setSelectedTaskForUpdate(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging update');
    } finally {
      setSavingUpdate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Tasks</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View assigned tasks and submit daily updates.
          </p>
        </div>

        <Button
          variant="primary"
          icon={FiPlus}
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
        >
          New Task
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
          <FiFilter className="w-4 h-4 text-blue-600" /> Filters
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Priority Dropdown */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {(statusFilter || priorityFilter) && (
          <button
            onClick={() => {
              setStatusFilter('');
              setPriorityFilter('');
            }}
            className="text-xs text-rose-500 font-semibold hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Task List (Listed horizontally downwards) */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : displayedTasks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <p className="text-xs text-slate-500">No tasks found matching criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onLogUpdate={(t) => setSelectedTaskForUpdate(t)}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
        loading={savingTask}
        isManager={false}
      />

      {/* Daily Update Modal */}
      <DailyUpdateModal
        isOpen={Boolean(selectedTaskForUpdate)}
        onClose={() => setSelectedTaskForUpdate(null)}
        task={selectedTaskForUpdate}
        onSubmit={handleUpdateSubmit}
        loading={savingUpdate}
      />
    </div>
  );
};
