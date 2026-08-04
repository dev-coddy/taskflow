import Task from '../models/Task.js';
import DailyUpdate from '../models/DailyUpdate.js';

// @desc    Get all tasks with filtering
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { assignedTo, status, priority, search, dueDate } = req.query;
    let query = {};

    // Employee role defaults to their own tasks unless filtering
    if (req.user.role === 'Employee') {
      query.assignedTo = req.user._id;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (dueDate) {
      const start = new Date(dueDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dueDate);
      end.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: start, $lte: end };
    }

    const tasks = await Task.find(query)
      .populate('assignedBy', 'name email department profileImage')
      .populate('assignedTo', 'name email department profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task details with DailyUpdates history
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedBy', 'name email department profileImage')
      .populate('assignedTo', 'name email department profileImage');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Fetch historical daily updates for this task
    const updates = await DailyUpdate.find({ taskId: task._id })
      .populate('employeeId', 'name email profileImage')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        task,
        updates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, assignedTo, dueDate, timeSpent } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title and due date are required' });
    }

    // Default assignedTo to self if employee creating personal task
    const targetAssignee = req.user.role === 'Employee' ? req.user._id : (assignedTo || req.user._id);

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      status: 'Not Started',
      assignedBy: req.user._id,
      assignedTo: targetAssignee,
      dueDate,
      timeSpent: timeSpent ? Number(timeSpent) : 0
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedBy', 'name email department profileImage')
      .populate('assignedTo', 'name email department profileImage');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Employees can only update their assigned tasks or tasks created by them
    if (
      req.user.role === 'Employee' &&
      task.assignedTo.toString() !== req.user._id.toString() &&
      task.assignedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this task' });
    }

    const { title, description, priority, status, assignedTo, dueDate, timeSpent } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (assignedTo && req.user.role === 'Manager') task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;
    if (timeSpent !== undefined) task.timeSpent = Number(timeSpent);

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedBy', 'name email department profileImage')
      .populate('assignedTo', 'name email department profileImage');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (
      req.user.role !== 'Manager' &&
      task.assignedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    // Clean up associated daily updates
    await DailyUpdate.deleteMany({ taskId: task._id });
    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task and associated daily updates deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
