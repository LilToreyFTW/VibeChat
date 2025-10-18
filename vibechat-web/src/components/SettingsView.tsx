'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    theme: 'dark',
    language: 'en',
    autoStart: false,
    dataCollection: true,
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: '🎨',
      items: [
        {
          label: 'Theme',
          type: 'select' as const,
          key: 'theme',
          value: settings.theme,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' },
          ],
        },
        {
          label: 'Language',
          type: 'select' as const,
          key: 'language',
          value: settings.language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
          ],
        },
      ],
    },
    {
      title: 'Notifications',
      icon: '🔔',
      items: [
        {
          label: 'Enable Notifications',
          type: 'toggle' as const,
          key: 'notifications',
          value: settings.notifications,
        },
        {
          label: 'Sound Effects',
          type: 'toggle' as const,
          key: 'sound',
          value: settings.sound,
        },
      ],
    },
    {
      title: 'Privacy & Data',
      icon: '🔒',
      items: [
        {
          label: 'Data Collection',
          type: 'toggle' as const,
          key: 'dataCollection',
          value: settings.dataCollection,
          description: 'Help improve VibeChat by sharing usage data',
        },
      ],
    },
    {
      title: 'System',
      icon: '⚙️',
      items: [
        {
          label: 'Auto-start on login',
          type: 'toggle' as const,
          key: 'autoStart',
          value: settings.autoStart,
        },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-500/20"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
        <p className="text-gray-300 text-lg">
          Customize your VibeChat experience and manage your preferences.
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + sectionIndex * 0.1 }}
            className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>
            </div>

            {/* Section Items */}
            <div className="p-6 space-y-6">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + sectionIndex * 0.1 + itemIndex * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.label}</h3>
                    {item.description && (
                      <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                    )}
                  </div>

                  <div className="ml-4">
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          settings[item.key as keyof typeof settings] ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : item.type === 'select' ? (
                      <select
                        value={settings[item.key as keyof typeof settings]}
                        onChange={(e) => handleSettingChange(item.key, e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {item.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Profile Information</h3>
              <p className="text-gray-400 text-sm">Manage your account details and preferences</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Security Settings</h3>
              <p className="text-gray-400 text-sm">Password, two-factor authentication, and login history</p>
            </div>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Manage Security
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div>
              <h3 className="text-red-400 font-medium">Danger Zone</h3>
              <p className="text-gray-400 text-sm">Irreversible actions that affect your account</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
        >
          Save Changes
        </motion.button>
      </motion.div>
    </div>
  );
};
