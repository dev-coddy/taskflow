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

    console.log('👤 Seeding default Users...');
    const manager = await User.create({
      name: 'Elena Rostova',
      email: 'manager@taskflow.com',
      password: 'Password123!',
      role: 'Manager',
      department: 'Engineering & QA',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
    });

    const alex = await User.create({
      name: 'Alex Turner',
      email: 'alex@taskflow.com',
      password: 'Password123!',
      role: 'Employee',
      department: 'Frontend Development',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    });

    const sarah = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@taskflow.com',
      password: 'Password123!',
      role: 'Employee',
      department: 'QA & Testing',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80'
    });

    const david = await User.create({
      name: 'David Miller',
      email: 'david@taskflow.com',
      password: 'Password123!',
      role: 'Employee',
      department: 'Backend Services',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
    });

    console.log('📋 Seeding sample Tasks...');
    const today = new Date();
    const inThreeDays = new Date();
    inThreeDays.setDate(today.getDate() + 3);

    const task1 = await Task.create({
      title: 'Regression Suite Automation',
      description: 'Automate checkout flow end-to-end scripts using Playwright',
      priority: 'High',
      status: 'In Progress',
      assignedBy: manager._id,
      assignedTo: sarah._id,
      dueDate: inThreeDays
    });

    const task2 = await Task.create({
      title: 'Dashboard Dark Mode Glassmorphism Redesign',
      description: 'Implement sleek dark mode theme with modern card aesthetics',
      priority: 'Critical',
      status: 'Completed',
      assignedBy: manager._id,
      assignedTo: alex._id,
      dueDate: today
    });

    const task3 = await Task.create({
      title: 'MongoDB Query Performance Optimization',
      description: 'Add compound indexes on daily updates collection by date and employeeId',
      priority: 'Medium',
      status: 'In Progress',
      assignedBy: manager._id,
      assignedTo: david._id,
      dueDate: inThreeDays
    });

    const task4 = await Task.create({
      title: 'Stripe Payment Webhook Endpoint Fix',
      description: 'Investigate edge cases when receiving duplicate webhook payloads',
      priority: 'Critical',
      status: 'Blocked',
      assignedBy: manager._id,
      assignedTo: david._id,
      dueDate: today
    });

    console.log('📝 Seeding Daily Status Updates...');
    await DailyUpdate.create({
      taskId: task1._id,
      employeeId: sarah._id,
      date: today,
      status: 'In Progress',
      remarks: 'Completed 12 test scenarios for payment processing. 3 test suites pending execution.',
      hoursWorked: 6.5
    });

    await DailyUpdate.create({
      taskId: task2._id,
      employeeId: alex._id,
      date: today,
      status: 'Completed',
      remarks: 'Finalized glassmorphic dark mode styles, verified color contrast accessibility, and published builds.',
      hoursWorked: 7.0
    });

    await DailyUpdate.create({
      taskId: task4._id,
      employeeId: david._id,
      date: today,
      status: 'Blocked',
      remarks: 'Waiting for Sandbox API credentials update from third-party vendor.',
      hoursWorked: 3.5
    });

    console.log('✨ Seed complete! Default credentials:');
    console.log('   Manager: manager@taskflow.com | Password: Password123!');
    console.log('   Employee 1: alex@taskflow.com | Password: Password123!');
    console.log('   Employee 2: sarah@taskflow.com | Password: Password123!');
    console.log('   Employee 3: david@taskflow.com | Password: Password123!');

    return { manager, alex, sarah, david };
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
};

// If run directly via node CLI
if (process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => process.exit(0));
}
