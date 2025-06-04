import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuthPage from '../pages/auth/AuthPage';

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthPage />,
  }
]; 