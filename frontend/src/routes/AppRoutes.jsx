import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';

import { useAuth } from '../context/AuthContext';

// Manager Pages
import { ManagerDashboard } from '../pages/manager/ManagerDashboard';
import { EmployeeManagementPage } from '../pages/manager/EmployeeManagementPage';
import { TaskManagementPage } from '../pages/manager/TaskManagementPage';
import { EmailGeneratorPage } from '../pages/manager/EmailGeneratorPage';
import { ReportsPage } from '../pages/manager/ReportsPage';

// Employee Pages
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { MyTasksPage } from '../pages/employee/MyTasksPage';
import { HistoryPage } from '../pages/employee/HistoryPage';
import { ProfilePage } from '../pages/employee/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Smart component to render Dashboard according to user role
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'Manager') {
    return <ManagerDashboard />;
  }
  return <EmployeeDashboard />;
};

// Smart component to render Tasks page according to user role
const RoleBasedTasks = () => {
  const { user } = useAuth();
  if (user?.role === 'Manager') {
    return <TaskManagementPage />;
  }
  return <MyTasksPage />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Routes inside Main Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Adaptive Routes */}
          <Route path="/dashboard" element={<RoleBasedDashboard />} />
          <Route path="/tasks" element={<RoleBasedTasks />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Employee Routes */}
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/history" element={<HistoryPage />} />

          {/* Manager Routes */}
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/employees" element={<EmployeeManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/email-generator" element={<EmailGeneratorPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
