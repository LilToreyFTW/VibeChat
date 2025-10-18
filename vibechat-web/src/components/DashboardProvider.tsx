'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: any;
  setUser: (user: any) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  serverStatus: {
    webServer: boolean;
    chatServer: boolean;
    roomServer: boolean;
    desktopApp: boolean;
  };
  setServerStatus: (status: any) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverStatus, setServerStatus] = useState({
    webServer: true,
    chatServer: false,
    roomServer: false,
    desktopApp: false,
  });

  // Check server status on mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      // Check if we're in development mode and servers might be running
      const promises = [
        fetch('http://localhost:3000/health').then(res => res.ok).catch(() => false),
        fetch('http://localhost:3001/health').then(res => res.ok).catch(() => false),
        fetch('http://localhost:3002/health').then(res => res.ok).catch(() => false),
      ];

      const results = await Promise.allSettled(promises);
      setServerStatus({
        webServer: true, // We're running the web server
        chatServer: results[1].status === 'fulfilled' ? results[1].value : false,
        roomServer: results[2].status === 'fulfilled' ? results[2].value : false,
        desktopApp: false, // Would need to check if desktop app is running
      });
    } catch (error) {
      console.error('Error checking server status:', error);
    }
  };

  const value = {
    currentView,
    setCurrentView,
    user,
    setUser,
    isConnected,
    setIsConnected,
    serverStatus,
    setServerStatus,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
