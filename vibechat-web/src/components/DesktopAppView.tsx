'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const DesktopAppView: React.FC = () => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const features = [
    {
      icon: '💬',
      title: 'Native Desktop Experience',
      description: 'Full-featured desktop application with native OS integration',
    },
    {
      icon: '🚀',
      title: 'Better Performance',
      description: 'Optimized for desktop hardware with faster load times',
    },
    {
      icon: '🔔',
      title: 'Native Notifications',
      description: 'System notifications and background operation support',
    },
    {
      icon: '🔒',
      title: 'Offline Support',
      description: 'Continue using the app even when offline',
    },
    {
      icon: '🎨',
      title: 'Customizable UI',
      description: 'Theme support and interface customization options',
    },
    {
      icon: '📁',
      title: 'File Integration',
      description: 'Easy file sharing and drag-and-drop support',
    },
  ];

  const systemRequirements = {
    windows: {
      os: 'Windows 10 or later',
      processor: 'Intel Core i3 or equivalent',
      memory: '4 GB RAM',
      storage: '500 MB free space',
      graphics: 'DirectX 11 compatible',
    },
    macos: {
      os: 'macOS 10.15 or later',
      processor: 'Intel Core i3 or Apple Silicon',
      memory: '4 GB RAM',
      storage: '500 MB free space',
      graphics: 'Metal compatible',
    },
    linux: {
      os: 'Ubuntu 18.04+, CentOS 7+, or similar',
      processor: 'Intel Core i3 or equivalent',
      memory: '4 GB RAM',
      storage: '500 MB free space',
      graphics: 'OpenGL 3.3 compatible',
    },
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          // In a real app, this would trigger the actual download
          window.open('/downloads/VibeChat%20Desktop%20Setup%201.0.0.exe', '_blank');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Desktop Application</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Experience VibeChat on your desktop with native performance, system integration, and advanced features.
          </p>
        </div>
      </motion.div>

      {/* Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 rounded-lg p-8 border border-slate-700"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🖥️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Download VibeChat Desktop</h2>
          <p className="text-gray-400">Version 1.0.0 • Windows 64-bit</p>
        </div>

        <div className="max-w-md mx-auto">
          {isDownloading ? (
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Downloading...</span>
                  <span className="text-purple-400">{Math.round(downloadProgress)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadProgress}%` }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l4-4m-4 4l-4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Download for Windows</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Desktop Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* System Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <h2 className="text-xl font-bold text-white mb-6">System Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(systemRequirements).map(([platform, reqs]) => (
            <div key={platform} className="space-y-3">
              <h3 className="text-lg font-semibold text-white capitalize">{platform}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">OS:</span>
                  <span className="text-white">{reqs.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processor:</span>
                  <span className="text-white">{reqs.processor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Memory:</span>
                  <span className="text-white">{reqs.memory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage:</span>
                  <span className="text-white">{reqs.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Graphics:</span>
                  <span className="text-white">{reqs.graphics}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Installation Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <h2 className="text-xl font-bold text-white mb-4">Installation Guide</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="text-white font-medium">Download the installer</h4>
              <p className="text-gray-400 text-sm">Click the download button above to get the latest version</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="text-white font-medium">Run the installer</h4>
              <p className="text-gray-400 text-sm">Double-click the downloaded .exe file to start installation</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="text-white font-medium">Follow the setup wizard</h4>
              <p className="text-gray-400 text-sm">Complete the installation process with default settings</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
            <div>
              <h4 className="text-white font-medium">Launch VibeChat</h4>
              <p className="text-gray-400 text-sm">Find VibeChat in your Start Menu and launch the application</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
