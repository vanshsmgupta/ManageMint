import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';

const MarketerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <div className="pl-64 min-h-screen">
        <main className="py-6 px-6">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketerLayout; 