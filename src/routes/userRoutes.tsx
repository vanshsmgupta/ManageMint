import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Dashboard from '../pages/user/Dashboard';
import Timesheet from '../pages/user/Timesheet';
import MyOffers from '../pages/user/MyOffers';
import Calendar from '../pages/user/Calendar';
import Profile from '../pages/user/Profile';
import NotificationList from '../components/notifications/NotificationList';
import UserLayout from '../components/Layout/UserLayout';
import { useAuth } from '../context/AuthContext';

const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, isAdmin, isMarketer } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  if (isMarketer) {
    return <Navigate to="/marketer/dashboard" />;
  }

  return <>{children}</>;
};

export const userRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <UserProtectedRoute>
        <UserLayout />
      </UserProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'timesheet',
        element: <Timesheet />
      },
      {
        path: 'notifications',
        element: <NotificationList />
      },
      {
        path: 'offers',
        element: <MyOffers />
      },
      {
        path: 'calendar',
        element: <Calendar />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]; 