'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from './DashboardProvider';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentView, setCurrentView, serverStatus } = useDashboard();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'chat', label: 'Chat Rooms', icon: '💬' },
    { id: 'admin', label: 'Admin Panel', icon: '⚙️' },
    { id: 'desktop', label: 'Desktop App', icon: '🖥️' },
    { id: 'settings', label: 'Settings', icon: '🔧' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between p-6 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VibeChat
          </Link>

          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Server Status Indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${serverStatus.webServer ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-300">Web</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${serverStatus.chatServer ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-300">Chat</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${serverStatus.roomServer ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-300">Rooms</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${serverStatus.desktopApp ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-gray-300">Desktop</span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          VibeChat
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
          <div className="px-4 py-3 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Server Status */}
          <div className="px-4 pb-3 flex items-center justify-between text-xs">
            <span className="text-gray-400">Server Status:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${serverStatus.webServer ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-300">Web</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${serverStatus.chatServer ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-300">Chat</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${serverStatus.roomServer ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-300">Rooms</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
