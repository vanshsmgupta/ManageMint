import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout';
import AdminProtectedRoute from '../components/auth/AdminProtectedRoute';
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import Marketers from '../pages/admin/Marketers';
import Notifications from '../pages/admin/Notifications';
import PendingApprovals from '../pages/admin/PendingApprovals';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'users',
        element: <UserManagement />
      },
      {
        path: 'marketers',
        element: <Marketers />
      },
      {
        path: 'notifications',
        element: <Notifications />
      },
      {
        path: 'pending-approvals',
        element: <PendingApprovals />
      }
    ]
  }
]; 