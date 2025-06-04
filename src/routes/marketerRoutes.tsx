import { RouteObject } from 'react-router-dom';
import MarketerLayout from '../layouts/MarketerLayout';
import MarketerProtectedRoute from '../components/auth/MarketerProtectedRoute';
import Dashboard from '../pages/marketer/Dashboard';
import Offers from '../pages/marketer/Offers';
import OfferGenerated from '../pages/marketer/OfferGenerated';
import Calendar from '../pages/marketer/Calendar';
import Profile from '../pages/marketer/Profile';

export const marketerRoutes: RouteObject[] = [
  {
    path: '/marketer',
    element: (
      <MarketerProtectedRoute>
        <MarketerLayout />
      </MarketerProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'offers',
        element: <Offers />
      },
      {
        path: 'offers/generated',
        element: <OfferGenerated />
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