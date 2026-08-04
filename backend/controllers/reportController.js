import User from '../models/User.js';
import Task from '../models/Task.js';
import DailyUpdate from '../models/DailyUpdate.js';
import { buildEODEmail } from '../services/emailGeneratorService.js';

// @desc    Get dashboard KPIs and analytics metrics
// @route   GET /api/reports/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const isManager = req.user.role === 'Manager';
    const userId = req.user._id;

    if (isManager) {
      // Manager Stats
      const totalEmployees = await User.countDocuments({ role: 'Employee', isActive: true });
      const totalTasks = await Task.countDocuments();
      const completedTasks = await Task.countDocuments({ status: 'Completed' });
      const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
      const notStartedTasks = await Task.countDocuments({ status: 'Not Started' });
      const blockedTasks = await Task.countDocuments({ status: 'Blocked' });

      // Recent updates for today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayUpdatesCount = await DailyUpdate.countDocuments({
        date: { $gte: startOfDay }
      });

      const recentUpdates = await DailyUpdate.find()
        .populate('taskId', 'title priority status timeSpent')
        .populate('employeeId', 'name department role profileImage')
        .sort({ createdAt: -1, date: -1 })
        .limit(10);

      // Task Priority Distribution
      const priorityCounts = {
        Low: await Task.countDocuments({ priority: 'Low' }),
        Medium: await Task.countDocuments({ priority: 'Medium' }),
        High: await Task.countDocuments({ priority: 'High' }),
        Critical: await Task.countDocuments({ priority: 'Critical' })
      };

      // Task Status Distribution
      const statusCounts = {
        'Not Started': notStartedTasks,
        'In Progress': inProgressTasks,
        'Completed': completedTasks,
        'Blocked': blockedTasks
      };

      res.status(200).json({
        success: true,
        data: {
          role: 'Manager',
          cards: {
            totalEmployees,
            totalTasks,
            completedTasks,
            pendingTasks: notStartedTasks + inProgressTasks,
            blockedTasks,
            todayUpdatesCount,
            completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          },
          charts: {
            statusDistribution: [
              { name: 'Not Started', value: notStartedTasks, fill: '#64748B' },
              { name: 'In Progress', value: inProgressTasks, fill: '#2563EB' },
              { name: 'Completed', value: completedTasks, fill: '#10B981' },
              { name: 'Blocked', value: blockedTasks, fill: '#EF4444' }
            ],
            priorityDistribution: [
              { name: 'Low', count: priorityCounts.Low, fill: '#10B981' },
              { name: 'Medium', count: priorityCounts.Medium, fill: '#2563EB' },
              { name: 'High', count: priorityCounts.High, fill: '#F59E0B' },
              { name: 'Critical', count: priorityCounts.Critical, fill: '#EF4444' }
            ]
          },
          recentUpdates
        }
      });
    } else {
      // Employee Stats
      const assignedTasksCount = await Task.countDocuments({ assignedTo: userId });
      const completedTasksCount = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });
      const inProgressTasksCount = await Task.countDocuments({ assignedTo: userId, status: 'In Progress' });
      const notStartedTasksCount = await Task.countDocuments({ assignedTo: userId, status: 'Not Started' });
      const blockedTasksCount = await Task.countDocuments({ assignedTo: userId, status: 'Blocked' });

      // Today's update status
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayUpdates = await DailyUpdate.find({
        employeeId: userId,
        date: { $gte: startOfDay }
      }).populate('taskId', 'title priority status');

      const recentTasks = await Task.find({ assignedTo: userId })
        .populate('assignedBy', 'name profileImage')
        .sort({ dueDate: 1 })
        .limit(5);

      res.status(200).json({
        success: true,
        data: {
          role: 'Employee',
          cards: {
            assigned: assignedTasksCount,
            completed: completedTasksCount,
            pending: notStartedTasksCount + inProgressTasksCount,
            blocked: blockedTasksCount,
            loggedToday: todayUpdates.length > 0
          },
          todayUpdates,
          recentTasks
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Generate EOD email string
// @route   POST /api/reports/generate-email
// @access  Private (Manager only)
export const generateEODEmailReport = async (req, res, next) => {
  try {
    const { date, department } = req.body;

    const emailResult = await buildEODEmail({
      date,
      department,
      managerName: req.user.name
    });

    res.status(200).json({
      success: true,
      data: emailResult
    });
  } catch (error) {
    next(error);
  }
};
