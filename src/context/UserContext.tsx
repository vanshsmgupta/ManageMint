import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'team_lead' | 'marketer';
  dob: string;
  doj: string;
  status: 'active' | 'inactive';
  isTeamLead: boolean;
  tempPassword?: string;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
}

interface UserContextType {
  users: User[];
  activities: Activity[];
  addUser: (user: Omit<User, 'id' | 'status' | 'tempPassword'>) => { user: User; tempPassword: string };
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserStats: () => { totalUsers: number; totalMarketers: number };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  // Persist users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Persist activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (action: string, user: string) => {
    const now = new Date();
    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      user,
      time: now.toLocaleString(),
    };
    setActivities([newActivity, ...activities.slice(0, 9)]); // Keep only last 10 activities
  };

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const addUser = (userData: Omit<User, 'id' | 'status' | 'tempPassword'>) => {
    const tempPassword = generateTempPassword();
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      tempPassword,
    };
    
    setUsers([...users, newUser]);
    addActivity(
      `New ${newUser.role === 'user' ? 'Engineer' : newUser.role === 'team_lead' ? 'Team Lead' : 'Marketer'} Account Created`,
      newUser.name
    );

    return { user: newUser, tempPassword };
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
    addActivity('Account Updated', userData.name || 'Unknown');
  };

  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setUsers(users.filter(u => u.id !== id));
      addActivity('Account Deactivated', user.name);
    }
  };

  const getUserStats = () => {
    const totalUsers = users.filter(user => (user.role === 'user' || user.role === 'team_lead') && user.status === 'active').length;
    const totalMarketers = users.filter(user => user.role === 'marketer' && user.status === 'active').length;
    return { totalUsers, totalMarketers };
  };

  return (
    <UserContext.Provider
      value={{
        users,
        activities,
        addUser,
        updateUser,
        deleteUser,
        getUserStats,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 