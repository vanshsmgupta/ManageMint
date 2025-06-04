import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Bell, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Control Room', path: '/admin/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: 'Engineers', path: '/admin/users' },
    { icon: <Users className="w-5 h-5" />, label: 'Marketers', path: '/admin/marketers' },
    { icon: <Clock className="w-5 h-5" />, label: 'Pending Approvals', path: '/admin/pending-approvals' },
    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', path: '/admin/notifications' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1C1F26] min-h-screen fixed left-0 flex flex-col">
          <div className="px-3 py-6">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-gray-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 