import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <UserSidebar />
      <div className="pl-64">
        <main className="py-6 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout; 