import DailyUpdate from '../models/DailyUpdate.js';
import Task from '../models/Task.js';

// @desc    Create a daily status update for a task
// @route   POST /api/updates
// @access  Private
export const createDailyUpdate = async (req, res, next) => {
  try {
    const { taskId, status, remarks, hoursWorked, date } = req.body;

    if (!taskId || !status || !remarks) {
      return res.status(400).json({ success: false, message: 'TaskId, status, and remarks are required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Associated task not found' });
    }

    // Verify employee owns the task or is manager
    if (
      req.user.role === 'Employee' &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to log updates for this task' });
    }

    // Create the DailyUpdate log (creates historical record)
    const update = await DailyUpdate.create({
      taskId,
      employeeId: req.user._id,
      date: date ? new Date(date) : new Date(),
      status,
      remarks,
      hoursWorked: hoursWorked ? Number(hoursWorked) : 0
    });

    // Update parent Task status & accumulate time spent to reflect latest update
    task.status = status;
    if (hoursWorked) {
      task.timeSpent = (task.timeSpent || 0) + Number(hoursWorked);
    }
    await task.save();

    const populatedUpdate = await DailyUpdate.findById(update._id)
      .populate('taskId', 'title priority status dueDate timeSpent')
      .populate('employeeId', 'name email department role profileImage');

    res.status(201).json({
      success: true,
      message: 'Daily update logged successfully',
      data: populatedUpdate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily updates with filtering (by date, employee, task, status)
// @route   GET /api/updates
// @access  Private
export const getDailyUpdates = async (req, res, next) => {
  try {
    const { date, employeeId, taskId, status } = req.query;
    let query = {};

    // Employee role defaults to their own updates unless manager is viewing
    if (req.user.role === 'Employee') {
      query.employeeId = req.user._id;
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    if (taskId) {
      query.taskId = taskId;
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const updates = await DailyUpdate.find(query)
      .populate('taskId', 'title priority status dueDate')
      .populate('employeeId', 'name email department profileImage')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: updates.length,
      data: updates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a daily update entry
// @route   DELETE /api/updates/:id
// @access  Private
export const deleteDailyUpdate = async (req, res, next) => {
  try {
    const update = await DailyUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ success: false, message: 'Update entry not found' });
    }

    if (
      req.user.role !== 'Manager' &&
      update.employeeId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this update entry' });
    }

    await update.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Daily update entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
