import React, { useState, useEffect } from 'react';
import { Bell, UserPlus, Users, AlertTriangle, Check, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'user' | 'marketer' | 'system' | 'warning';
  message: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = 'admin_notifications';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Initialize from localStorage or use default notifications if none exist
    const savedNotifications = localStorage.getItem(STORAGE_KEY);
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    return [
      {
        id: '1',
        type: 'user',
        message: 'John Doe has registered as a new user.',
        timestamp: '3/15/2024, 10:30:00 AM',
        read: false
      },
      {
        id: '2',
        type: 'marketer',
        message: 'Sarah Wilson has updated their profile information.',
        timestamp: '3/15/2024, 9:45:00 AM',
        read: false
      },
      {
        id: '3',
        type: 'warning',
        message: 'High server load detected. Please check system resources.',
        timestamp: '3/15/2024, 8:15:00 AM',
        read: false
      }
    ];
  });

  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'marketer':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'system':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserPlus className="w-5 h-5 text-blue-400" />;
      case 'marketer':
        return <Users className="w-5 h-5 text-green-400" />;
      case 'system':
        return <Bell className="w-5 h-5 text-purple-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const legendTypes = [
    { type: 'user', label: 'New User Registration', icon: UserPlus, color: 'blue' },
    { type: 'marketer', label: 'Marketer Updates', icon: Users, color: 'green' },
    { type: 'system', label: 'System Updates', icon: Bell, color: 'purple' },
    { type: 'warning', label: 'System Warnings', icon: AlertTriangle, color: 'amber' }
  ];

  const filteredNotifications = selectedType
    ? notifications.filter(n => n.type === selectedType)
    : notifications;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">Manage system notifications and alerts</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Notification Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {legendTypes.map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                onClick={() => handleTypeClick(type)}
                className={`
                  flex items-center space-x-3 p-4 rounded-lg border
                  transition-all duration-200 transform hover:scale-[1.02]
                  ${selectedType === type 
                    ? `bg-${color}-500/20 border-${color}-500/40 ring-2 ring-${color}-500/40` 
                    : `bg-${color}-500/10 border-${color}-500/20 hover:bg-${color}-500/15`
                  }
                  cursor-pointer
                `}
              >
                <Icon className={`w-5 h-5 text-${color}-400`} />
                <span className={`text-${color}-400`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">
              {unreadCount} Unread Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationStyles(notification.type)} transition-all duration-200 hover:transform hover:scale-[1.01] hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div>
                      <p className="text-white">{notification.message}</p>
                      <p className="text-sm text-gray-400 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        className="p-1 hover:bg-gray-700/50 rounded transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-1 hover:bg-gray-700/50 rounded transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No notifications found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;