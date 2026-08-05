import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import DailyUpdate from '../models/DailyUpdate.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Task.deleteMany({});
    await DailyUpdate.deleteMany({});

    console.log('👤 Seeding default Manager & Employee Users...');
    const manager = await User.create({
      name: 'Elena Rostova',
      email: 'manager@taskflow.com',
      password: 'Password123!',
      role: 'Manager',
      department: 'Engineering & QA',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
    });

    const talent = await User.create({
      name: 'Talent',
      email: 'talent@taskflow.com',
      password: 'Talen7@2004',
      role: 'Employee',
      department: 'Software Engineering',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    });

    console.log('📋 Seeding sample Tasks for Talent...');
    const today = new Date();
    const inThreeDays = new Date();
    inThreeDays.setDate(today.getDate() + 3);

    const task1 = await Task.create({
      title: 'Regression Suite Automation',
      description: 'Automate checkout flow end-to-end scripts using Playwright',
      priority: 'High',
      status: 'In Progress',
      assignedBy: manager._id,
      assignedTo: talent._id,
      dueDate: inThreeDays
    });

    const task2 = await Task.create({
      title: 'Dashboard Dark Mode Glassmorphism Redesign',
      description: 'Implement sleek dark mode theme with modern card aesthetics',
      priority: 'Critical',
      status: 'Completed',
      assignedBy: manager._id,
      assignedTo: talent._id,
      dueDate: today
    });

    const task3 = await Task.create({
      title: 'MongoDB Query Performance Optimization',
      description: 'Add compound indexes on daily updates collection by date and employeeId',
      priority: 'Medium',
      status: 'In Progress',
      assignedBy: manager._id,
      assignedTo: talent._id,
      dueDate: inThreeDays
    });

    console.log('📝 Seeding Daily Status Updates...');
    await DailyUpdate.create({
      taskId: task1._id,
      employeeId: talent._id,
      date: today,
      status: 'In Progress',
      remarks: 'Completed 12 test scenarios for payment processing. 3 test suites pending execution.',
      hoursWorked: 6.5
    });

    await DailyUpdate.create({
      taskId: task2._id,
      employeeId: talent._id,
      date: today,
      status: 'Completed',
      remarks: 'Finalized glassmorphic dark mode styles, verified color contrast accessibility, and published builds.',
      hoursWorked: 7.0
    });

    console.log('✨ Seed complete! Default credentials:');
    console.log('   Manager: manager@taskflow.com | Password: Password123!');
    console.log('   Employee: talent@taskflow.com | Password: Talen7@2004');

    return { manager, talent };
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
};

// If run directly via node CLI
if (process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => process.exit(0));
}
