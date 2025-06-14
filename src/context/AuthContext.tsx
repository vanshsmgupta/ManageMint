import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await mockLoginAPI(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      // Clear any other auth-related data
      localStorage.removeItem('userProfile');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');

    // Get users from localStorage
    const storedUsers = localStorage.getItem('users');
    const storedMarketers = localStorage.getItem('marketers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const marketers = storedMarketers ? JSON.parse(storedMarketers) : [];

    // Find the user in either users or marketers array
    const userList = user.role === 'marketer' ? marketers : users;
    const userIndex = userList.findIndex((u: any) => u.id === user.id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Verify old password
    if (userList[userIndex].password !== oldPassword && userList[userIndex].tempPassword !== oldPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    userList[userIndex].password = newPassword;
    userList[userIndex].tempPassword = undefined;

    // Save back to localStorage
    if (user.role === 'marketer') {
      localStorage.setItem('marketers', JSON.stringify(marketers));
    } else {
      localStorage.setItem('users', JSON.stringify(users));
    }

    return true;
  };

  const isAdmin = user?.role === 'admin';
  const isMarketer = user?.role === 'marketer';
  const isTeamLead = user?.isTeamLead || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      updatePassword,
      isAuthenticated, 
      isLoading,
      isAdmin,
      isMarketer,
      isTeamLead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data based on email
const mockLoginAPI = async (email: string, password: string) => {
  // Validate inputs
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Get stored users and marketers
  const storedUsers = localStorage.getItem('users');
  const storedMarketers = localStorage.getItem('marketers');
  const users = storedUsers ? JSON.parse(storedUsers) : [];
  const marketers = storedMarketers ? JSON.parse(storedMarketers) : [];

  // Find user or marketer by email
  const user = users.find((u: any) => u.email === email);
  const marketer = marketers.find((m: any) => m.email === email);

  // Special case for admin
  if (email === 'admin@taskmanagement.com' && password.length >= 6) {
    return {
      user: {
        id: 'admin',
        email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        dateOfBirth: new Date('1990-01-01').toISOString(),
        joiningDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        profilePicture: null
      }
    };
  }

  // Check if user exists
  const foundUser = user || marketer;
  if (!foundUser) {
    throw new Error('Invalid email or password');
  }

  // For first-time login, check if password matches temporary password
  if (foundUser.tempPassword && password === foundUser.tempPassword) {
    // Password is correct
  } else if (foundUser.tempPassword && password !== foundUser.tempPassword) {
    throw new Error('Invalid password');
  } else if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Create user object with correct structure
  const userObject = {
    id: foundUser.id,
    email: foundUser.email,
    firstName: foundUser.name.split(' ')[0],
    lastName: foundUser.name.split(' ')[1] || '',
    role: user ? 'user' : 'marketer',
    dateOfBirth: foundUser.dob || foundUser.dateOfBirth || new Date('1990-01-01').toISOString(),
    joiningDate: foundUser.doj || foundUser.joinDate || new Date().toISOString(),
    lastActive: new Date().toISOString(),
    profilePicture: null
  };

  return { user: userObject };
};