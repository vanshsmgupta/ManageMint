import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Clock, Calendar, UserCircle, DollarSign, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

const UserSidebar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Clock className="w-5 h-5" />, label: 'Timesheet', path: '/timesheet' },
    { 
      icon: <Bell className="w-5 h-5" />, 
      label: 'Notifications', 
      path: '/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { icon: <DollarSign className="w-5 h-5" />, label: 'My Offers', path: '/offers' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Calendar', path: '/calendar' },
    { icon: <UserCircle className="w-5 h-5" />, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to the auth page
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700 h-screen fixed left-0 top-0 flex flex-col">
      <div className="flex-1">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Drishya</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <motion.li
                key={item.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'User Name'}
            </p>
            <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSidebar; 