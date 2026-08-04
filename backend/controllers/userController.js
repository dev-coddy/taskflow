import User from '../models/User.js';

// @desc    Get all users/employees
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res, next) => {
  try {
    const { role, department, search } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user (Manager feature)
// @route   POST /api/users
// @access  Private (Manager only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, profileImage } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const newUser = await User.create({
      name,
      email,
      password: password || 'TaskFlow123!',
      role: role || 'Employee',
      department: department || 'Engineering',
      profileImage: profileImage || undefined
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private (Manager only)
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, isActive, profileImage } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Another user already exists with this email' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (role) user.role = role;
    if (department !== undefined) user.department = department;
    if (profileImage) user.profileImage = profileImage;
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Manager only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
