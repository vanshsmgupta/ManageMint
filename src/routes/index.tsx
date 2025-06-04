import React from 'react';
import { RouteObject } from 'react-router-dom';
import { userRoutes } from './userRoutes';
import { adminRoutes } from './adminRoutes';
import { authRoutes } from './authRoutes';
import { marketerRoutes } from './marketerRoutes';
import SplashScreen from '../components/SplashScreen';
import NotificationList from '../components/notifications/NotificationList';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <SplashScreen />,
  },
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
  ...marketerRoutes,
  { 
    path: '/notifications', 
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <NotificationList />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes; 