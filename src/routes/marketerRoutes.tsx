import { RouteObject } from 'react-router-dom';
import MarketerLayout from '../layouts/MarketerLayout';
import MarketerProtectedRoute from '../components/auth/MarketerProtectedRoute';

// Import all page components
import Dashboard from '../pages/marketer/Dashboard';
import Profile from '../pages/marketer/Profile';
import Calendar from '../pages/marketer/Calendar';
import Standup from '../pages/marketer/Standup';
import Consultants from '../pages/marketer/Consultants';
import Profiles from '../pages/marketer/Profiles';
import Submissions from '../pages/marketer/Submissions';
import Assessments from '../pages/marketer/Assessments';
import Offers from '../pages/marketer/Offers';
import Marketers from '../pages/marketer/Marketers';
import Vendors from '../pages/marketer/Vendors';
import POCs from '../pages/marketer/POCs';
import IP from '../pages/marketer/IP';
import Clients from '../pages/marketer/Clients';
import All from '../pages/marketer/All';

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
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'calendar',
        element: <Calendar />
      },
      {
        path: 'standup',
        element: <Standup />
      },
      {
        path: 'consultants',
        element: <Consultants />
      },
      {
        path: 'profiles',
        element: <Profiles />
      },
      {
        path: 'submissions',
        element: <Submissions />
      },
      {
        path: 'assessments',
        element: <Assessments />
      },
      {
        path: 'offers',
        element: <Offers />
      },
      {
        path: 'marketers',
        element: <Marketers />
      },
      // Contact section routes
      {
        path: 'vendors',
        element: <Vendors />
      },
      {
        path: 'pocs',
        element: <POCs />
      },
      {
        path: 'ip',
        element: <IP />
      },
      {
        path: 'clients',
        element: <Clients />
      },
      {
        path: 'all',
        element: <All />
      }
    ]
  }
]; 