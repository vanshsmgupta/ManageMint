import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications
  const notifications = [
    { id: '1', message: 'New offer added', time: '5 minutes ago' },
    { id: '2', message: 'Schedule updated', time: '1 hour ago' },
    { id: '3', message: 'Timesheet approved', time: '3 hours ago' },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-10">
      <button 
        onClick={toggleSidebar}
        className="lg:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-20">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium">Notifications</h3>
              </div>
              {notifications.length > 0 ? (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-500">No new notifications</p>
                </div>
              )}
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="mr-3 text-right hidden sm:block">
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.role}</p>
          </div>
          <img
            src={currentUser?.avatar || 'https://i.pravatar.cc/150?u=default'}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;