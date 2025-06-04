import React from 'react';
import { Bell, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const NotificationList = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'timesheet':
        return <Clock className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="bg-white/5 backdrop-blur-sm border-t-2 border-t-purple-500 border-x-0 border-b-0 rounded-lg overflow-hidden">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <CardTitle className="text-white/90">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p className="text-white/60">No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg transition-colors ${
                    notification.read 
                      ? 'bg-white/5' 
                      : 'bg-purple-500/10 border border-purple-500/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${
                          notification.read ? 'text-white/90' : 'text-purple-400'
                        }`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="ml-2 text-white/40 hover:text-white/60 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-white/60">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-white/40">
                          {format(new Date(notification.date), 'MMM d, yyyy h:mm a')}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationList; 