import React, { createContext, useContext, useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'timesheet' | 'general';
  date: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'app_notifications';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const savedNotifications = localStorage.getItem(STORAGE_KEY);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        // Convert date strings back to Date objects
        return parsed.map((notification: any) => ({
          ...notification,
          date: new Date(notification.date)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
    return [];
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  // Check for timesheet due dates and create notifications
  useEffect(() => {
    const checkTimesheetDue = () => {
      const today = new Date();
      const lastNotification = notifications.find(n => n.type === 'timesheet');
      
      // If no timesheet notification exists or the last one was more than a day ago
      if (!lastNotification || 
          (today.getTime() - new Date(lastNotification.date).getTime()) > 24 * 60 * 60 * 1000) {
        addNotification({
          title: 'Timesheet Due',
          message: 'Please fill out your timesheet for the current cycle.',
          type: 'timesheet'
        });
      }
    };

    // Check every hour
    const interval = setInterval(checkTimesheetDue, 60 * 60 * 1000);
    
    // Initial check
    checkTimesheetDue();

    return () => clearInterval(interval);
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 