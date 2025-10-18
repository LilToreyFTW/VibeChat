'use client';

import React from 'react';
import { useDashboard } from './DashboardProvider';
import { motion } from 'framer-motion';

export const DashboardOverview: React.FC = () => {
  const { serverStatus } = useDashboard();

  const stats = [
    {
      name: 'Active Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Rooms',
      value: '89',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      name: 'Messages Today',
      value: '12,345',
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      name: 'Server Uptime',
      value: '99.9%',
      change: '0%',
      changeType: 'neutral' as const,
    },
  ];

  const quickActions = [
    {
      name: 'Create Room',
      description: 'Start a new chat room',
      icon: '💬',
      action: () => console.log('Create room'),
    },
    {
      name: 'Join Room',
      description: 'Enter existing room',
      icon: '🚪',
      action: () => console.log('Join room'),
    },
    {
      name: 'Admin Panel',
      description: 'System administration',
      icon: '⚙️',
      action: () => console.log('Admin panel'),
    },
    {
      name: 'Desktop App',
      description: 'Launch desktop client',
      icon: '🖥️',
      action: () => console.log('Desktop app'),
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to VibeChat Dashboard
        </h1>
        <p className="text-gray-300 text-lg">
          Monitor your chat platform, manage rooms, and control all aspects of your communication ecosystem.
        </p>
      </motion.div>

      {/* Server Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {Object.entries(serverStatus).map(([server, status]) => (
          <div key={server} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 capitalize">
                  {server.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className={`text-2xl font-bold ${status ? 'text-green-400' : 'text-red-400'}`}>
                  {status ? 'Online' : 'Offline'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={action.action}
              className="bg-slate-800/50 hover:bg-slate-700/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{action.icon}</span>
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {action.name}
                </h3>
              </div>
              <p className="text-sm text-gray-400">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { time: '2 minutes ago', action: 'New user joined room "Gaming Squad"', type: 'user' },
            { time: '5 minutes ago', action: 'Room "Study Group" created', type: 'room' },
            { time: '10 minutes ago', action: 'Server maintenance completed', type: 'system' },
            { time: '15 minutes ago', action: 'Message sent in "General Chat"', type: 'message' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'user' ? 'bg-green-500' :
                activity.type === 'room' ? 'bg-blue-500' :
                activity.type === 'system' ? 'bg-purple-500' : 'bg-gray-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-300">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
