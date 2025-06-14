import React from 'react';
import { Home, Users, FileText, Send, CheckSquare, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Active Consultants',
      value: '0',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'Submissions',
      value: '0',
      icon: <Send className="w-6 h-6 text-green-400" />,
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'Assessments',
      value: '0',
      icon: <CheckSquare className="w-6 h-6 text-purple-400" />,
      change: '+0%',
      changeType: 'neutral'
    },
    {
      title: 'Active Offers',
      value: '0',
      icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
      change: '+0%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to your marketer dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="bg-gray-700/50 rounded-lg p-3">
                {stat.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-400'
                    : stat.changeType === 'negative'
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">{stat.value}</h2>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="text-gray-400 text-sm">No recent activity</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Tasks</h3>
          <div className="text-gray-400 text-sm">No upcoming tasks</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;