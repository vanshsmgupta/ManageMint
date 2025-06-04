import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import { MarketerProvider } from './context/MarketerContext';
import routes from './routes';

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <UserProvider>
          <MarketerProvider>
            <RouterProvider router={router} />
          </MarketerProvider>
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;