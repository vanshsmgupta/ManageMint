import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Bell, Clock, User, Briefcase } from 'lucide-react';
import { useUsers } from '../../context/UserContext';
import { useMarketers } from '../../context/MarketerContext';
import StatCard from '../../components/StatCard';
import { useNavigate } from 'react-router-dom';

type UserStatus = 'active' | 'inactive' | 'pending';

const AdminDashboard = () => {
  const { users, getUserStats } = useUsers();
  const { getMarketerStats, marketers } = useMarketers();
  const { totalMarketers, activeMarketers } = getMarketerStats();
  const { totalUsers } = getUserStats();
  const navigate = useNavigate();
  const [ongoingProjects, setOngoingProjects] = useState(0);

  // Calculate ongoing projects from localStorage
  useEffect(() => {
    const calculateOngoingProjects = () => {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      let totalOngoing = 0;

      allUsers.forEach((user: any) => {
        const userOffers = JSON.parse(localStorage.getItem(`offers_${user.id}`) || '[]');
        totalOngoing += userOffers.filter((offer: any) => offer.status === 'ongoing').length;
      });

      setOngoingProjects(totalOngoing);
    };

    calculateOngoingProjects();
  }, []);

  const stats = {
    combinedTotal: totalUsers + totalMarketers,
    regularUsers: totalUsers,
    pendingUsers: users.filter(user => (user.status as UserStatus) === 'pending').length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Drishya</h1>
        <p className="text-gray-400">Welcome to Drishya - Your Control Room</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Team"
          value={stats.combinedTotal}
          icon={Users}
          className="bg-gradient-to-br from-blue-400 to-blue-600 text-white"
          description="Engineers and marketers combined"
        />
        <StatCard
          title="Ongoing Projects"
          value={ongoingProjects}
          icon={Briefcase}
          className="bg-gradient-to-br from-pink-400 to-rose-600 text-white"
          description="Active projects in progress"
        />
        <StatCard
          title="Engineers"
          value={stats.regularUsers}
          icon={Users}
          className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
          description="Registered engineers"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Marketers"
          value={totalMarketers}
          icon={Users}
          className="bg-gradient-to-br from-amber-400 to-amber-600 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
          description="Registered marketers"
          onClick={() => navigate('/admin/marketers')}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingUsers}
          icon={Clock}
          className="bg-gradient-to-br from-violet-400 to-violet-600 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
          description="New Users awaiting approval"
          onClick={() => navigate('/admin/pending-approvals')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-lg shadow-lg p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-white">Recent Engineers</h2>
          <div className="space-y-4">
            {users.filter(user => user.role === 'user').slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  (user.status as UserStatus) === 'active' ? 'bg-emerald-400/20 text-emerald-400' : 
                  (user.status as UserStatus) === 'pending' ? 'bg-amber-400/20 text-amber-400' : 
                  'bg-red-400/20 text-red-400'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            ))}
            {users.filter(user => user.role === 'user').length === 0 && (
              <div className="text-center text-gray-400 py-4">
                No recent engineers
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-lg rounded-lg shadow-lg p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-white">Recent Marketers</h2>
          <div className="space-y-4">
            {marketers.slice(0, 5).map((marketer) => (
              <div key={marketer.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400/20 to-violet-600/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{marketer.name}</p>
                    <p className="text-sm text-gray-400">{marketer.email}</p>
                  </div>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  marketer.status === 'active' ? 'bg-emerald-400/20 text-emerald-400' : 
                  'bg-red-400/20 text-red-400'
                }`}>
                  {marketer.status.charAt(0).toUpperCase() + marketer.status.slice(1)}
                </span>
              </div>
            ))}
            {marketers.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                No recent marketers
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;