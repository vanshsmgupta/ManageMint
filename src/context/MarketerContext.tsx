import React, { createContext, useContext, useState, useEffect } from 'react';

interface Marketer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  specialization: string;
  clients: number;
  joinDate: string;
  tempPassword?: string;
  createdAt: string;
}

interface MarketerContextType {
  marketers: Marketer[];
  addMarketer: (marketer: Omit<Marketer, 'id' | 'status' | 'tempPassword' | 'createdAt'>) => { marketer: Marketer; tempPassword: string };
  updateMarketer: (id: string, updates: Partial<Marketer>) => void;
  deleteMarketer: (id: string) => void;
  getMarketerStats: () => { totalMarketers: number; activeMarketers: number };
}

const MarketerContext = createContext<MarketerContextType | undefined>(undefined);

export const useMarketers = () => {
  const context = useContext(MarketerContext);
  if (!context) {
    throw new Error('useMarketers must be used within a MarketerProvider');
  }
  return context;
};

export const MarketerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marketers, setMarketers] = useState<Marketer[]>(() => {
    const savedMarketers = localStorage.getItem('marketers');
    return savedMarketers ? JSON.parse(savedMarketers) : [];
  });

  useEffect(() => {
    localStorage.setItem('marketers', JSON.stringify(marketers));
  }, [marketers]);

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const addMarketer = (newMarketer: Omit<Marketer, 'id' | 'status' | 'tempPassword' | 'createdAt'>) => {
    const tempPassword = generateTempPassword();
    const marketer: Marketer = {
      id: Math.random().toString(36).substr(2, 9),
      ...newMarketer,
      status: 'active',
      tempPassword,
      createdAt: new Date().toISOString(),
    };
    setMarketers(prev => [...prev, marketer]);
    return { marketer, tempPassword };
  };

  const updateMarketer = (id: string, updates: Partial<Marketer>) => {
    setMarketers(prev =>
      prev.map(marketer =>
        marketer.id === id ? { ...marketer, ...updates } : marketer
      )
    );
  };

  const deleteMarketer = (id: string) => {
    setMarketers(prev => prev.filter(marketer => marketer.id !== id));
  };

  const getMarketerStats = () => {
    const activeMarketers = marketers.filter(m => m.status === 'active').length;
    return {
      totalMarketers: activeMarketers,
      activeMarketers: activeMarketers,
    };
  };

  return (
    <MarketerContext.Provider
      value={{
        marketers,
        addMarketer,
        updateMarketer,
        deleteMarketer,
        getMarketerStats,
      }}
    >
      {children}
    </MarketerContext.Provider>
  );
}; 