'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Room {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  activeUsers: number;
  maxUsers: number;
  isPrivate: boolean;
}

export const ChatRoomsView: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const categories = [
    { id: 'all', name: 'All Rooms', icon: '🏠' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'study', name: 'Study', icon: '📚' },
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'social', name: 'Social', icon: '👥' },
  ];

  useEffect(() => {
    // Fetch rooms from the chat-rooms server
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      // Set some mock data for demo
      setRooms([
        {
          id: '1',
          name: 'Gaming Squad',
          description: 'Discuss latest games and gaming news',
          category: 'gaming',
          icon: '🎮',
          color: '#10b981',
          activeUsers: 23,
          maxUsers: 100,
          isPrivate: false,
        },
        {
          id: '2',
          name: 'Study Group',
          description: 'Collaborative learning space',
          category: 'study',
          icon: '📚',
          color: '#f59e0b',
          activeUsers: 15,
          maxUsers: 50,
          isPrivate: false,
        },
        {
          id: '3',
          name: 'Workspace',
          description: 'Professional collaboration',
          category: 'work',
          icon: '💼',
          color: '#8b5cf6',
          activeUsers: 8,
          maxUsers: 25,
          isPrivate: true,
        },
      ]);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleJoinRoom = (roomId: string) => {
    // Open room in new window/tab
    window.open(`http://localhost:3001/room/${roomId}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Chat Rooms</h1>
          <p className="text-gray-400 mt-1">Join conversations and connect with others</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreatingRoom(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
        >
          Create Room
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Rooms Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200 group cursor-pointer"
            onClick={() => handleJoinRoom(room.id)}
          >
            {/* Room Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: room.color + '20', color: room.color }}
                >
                  {room.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      room.category === 'gaming' ? 'bg-green-900/50 text-green-400' :
                      room.category === 'study' ? 'bg-yellow-900/50 text-yellow-400' :
                      room.category === 'work' ? 'bg-purple-900/50 text-purple-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>
                      {room.category}
                    </span>
                    {room.isPrivate && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-900/50 text-gray-400">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Room Description */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {room.description}
            </p>

            {/* Room Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{room.activeUsers} online</span>
                </div>
                <span>•</span>
                <span>{room.maxUsers} max</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Join Room
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredRooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No rooms found</h3>
          <p className="text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'No rooms match the selected category'}
          </p>
        </motion.div>
      )}

      {/* Create Room Modal (placeholder) */}
      {isCreatingRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4 border border-slate-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Room</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room name"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Room description"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />
              <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="general">General</option>
                <option value="gaming">Gaming</option>
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="social">Social</option>
              </select>
            </div>
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                Create Room
              </button>
              <button
                onClick={() => setIsCreatingRoom(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
