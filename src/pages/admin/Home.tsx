import React from 'react';
import { Users } from 'lucide-react';
import { useUsers } from '../../context/UserContext';

const AdminHome = () => {
  const { getUserStats, activities } = useUsers();
  const { totalUsers, totalMarketers } = getUserStats();

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: <Users className="w-5 h-5 text-blue-600" />,
      description: 'Regular user accounts',
    },
    {
      title: 'Total Marketers',
      value: totalMarketers.toString(),
      icon: <Users className="w-5 h-5 text-green-600" />,
      description: 'Marketer accounts',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage user accounts and access</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-50 rounded-full">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Account Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">for {activity.user}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No recent activities
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome; 