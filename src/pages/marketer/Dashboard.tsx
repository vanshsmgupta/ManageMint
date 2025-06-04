import React from 'react';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Offers',
      value: '24',
      change: '+12%',
      icon: <DollarSign className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'Active Engineers',
      value: '18',
      change: '+5%',
      icon: <Users className="w-6 h-6 text-green-500" />,
    },
    {
      title: 'Upcoming Meetings',
      value: '7',
      change: '+2',
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
    },
    {
      title: 'Success Rate',
      value: '85%',
      change: '+3%',
      icon: <TrendingUp className="w-6 h-6 text-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's an overview of your activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-700/50 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Offers</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Senior React Developer</p>
                    <p className="text-sm text-gray-400">Tech Corp Inc.</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Meetings</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Client Meeting</p>
                    <p className="text-sm text-gray-400">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full hover:bg-purple-500/30">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;