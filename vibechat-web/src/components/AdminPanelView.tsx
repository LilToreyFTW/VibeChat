'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin' | 'super-admin';
  status: 'active' | 'suspended' | 'banned';
  lastSeen: string;
  joinDate: string;
}

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'rooms', name: 'Room Control', icon: '🏠' },
    { id: 'servers', name: 'Server Status', icon: '🖥️' },
    { id: 'security', name: 'Security', icon: '🔒' },
  ];

  const mockUsers: AdminUser[] = [
    {
      id: '1',
      username: 'alice_dev',
      email: 'alice@example.com',
      role: 'admin',
      status: 'active',
      lastSeen: '2 minutes ago',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      username: 'bob_gamer',
      email: 'bob@example.com',
      role: 'moderator',
      status: 'active',
      lastSeen: '1 hour ago',
      joinDate: '2024-02-20',
    },
    {
      id: '3',
      username: 'charlie_student',
      email: 'charlie@example.com',
      role: 'user',
      status: 'suspended',
      lastSeen: '3 days ago',
      joinDate: '2024-03-10',
    },
  ];

  const systemStats = {
    totalUsers: 1234,
    activeUsers: 567,
    totalRooms: 89,
    activeRooms: 45,
    messagesToday: 12345,
    uptime: '99.9%',
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`User action: ${action} for user ${userId}`);
    // In a real implementation, this would make API calls to the admin control system
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-2xl p-8 backdrop-blur-sm border border-red-500/20"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Admin Control Panel</h1>
        <p className="text-gray-300 text-lg">
          Complete system administration and monitoring dashboard
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 rounded-lg border border-slate-700"
      >
        <div className="flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {activeTab === 'overview' && (
          <>
            {/* System Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(systemStats).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                >
                  <div className="text-2xl font-bold text-white mb-2">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                  <div className="text-sm text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Emergency Stop', icon: '🛑', color: 'bg-red-600 hover:bg-red-700' },
                  { name: 'System Restart', icon: '🔄', color: 'bg-orange-600 hover:bg-orange-700' },
                  { name: 'Backup Data', icon: '💾', color: 'bg-blue-600 hover:bg-blue-700' },
                  { name: 'View Logs', icon: '📋', color: 'bg-green-600 hover:bg-green-700' },
                ].map((action, index) => (
                  <motion.button
                    key={action.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`${action.color} text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2`}
                  >
                    <span>{action.icon}</span>
                    <span>{action.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* User Management */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">User Management</h3>
                <p className="text-gray-400 text-sm">Manage user accounts, roles, and permissions</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            user.status === 'active' ? 'bg-green-500' :
                            user.status === 'suspended' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-white">{user.username}</h4>
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.role === 'super-admin' ? 'bg-red-900/50 text-red-400' :
                                user.role === 'admin' ? 'bg-orange-900/50 text-orange-400' :
                                user.role === 'moderator' ? 'bg-blue-900/50 text-blue-400' :
                                'bg-gray-900/50 text-gray-400'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-xs text-gray-500">Joined {user.joinDate} • Last seen {user.lastSeen}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUserAction(user.id, 'edit')}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, user.status === 'suspended' ? 'unsuspend' : 'suspend')}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              user.status === 'suspended'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            }`}
                          >
                            {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                          >
                            Ban
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'rooms' && (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Room Control</h3>
            <p className="text-gray-400">Room management interface coming soon...</p>
          </div>
        )}

        {activeTab === 'servers' && (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Server Status</h3>
            <p className="text-gray-400">Server monitoring interface coming soon...</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Security Center</h3>
            <p className="text-gray-400">Security management interface coming soon...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
