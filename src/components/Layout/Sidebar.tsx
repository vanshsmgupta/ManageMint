import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, DollarSign, Users, Settings, LogOut, UserCircle, Bell, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm rounded-lg mb-1 transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, isMarketer } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const isPathActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const adminLinks = [
    { path: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { path: '/admin/marketers', icon: <UserPlus size={18} />, label: 'Marketers' },
    { path: '/admin/notifications', icon: <Bell size={18} />, label: 'Notifications' },
  ];

  const marketerLinks = [
    { path: '/marketer/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/marketer/offers', icon: <DollarSign size={18} />, label: 'Offers' },
    { path: '/marketer/offers/generated', icon: <DollarSign size={18} />, label: 'Generated Offers' },
    { path: '/marketer/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
    { path: '/marketer/profile', icon: <UserCircle size={18} />, label: 'Profile' },
  ];

  const userLinks = [
    { path: '/user/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/user/timesheet', icon: <Clock size={18} />, label: 'Timesheet' },
    { path: '/user/offers', icon: <DollarSign size={18} />, label: 'My Offers' },
    { path: '/user/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
    { path: '/user/profile', icon: <UserCircle size={18} />, label: 'Profile' },
  ];

  const links = isAdmin ? adminLinks : isMarketer ? marketerLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <SidebarLink
              key={link.path}
              to={link.path}
              icon={link.icon}
              isActive={isPathActive(link.path)}
              onClick={handleLinkClick}
            >
              {link.label}
            </SidebarLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;