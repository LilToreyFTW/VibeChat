/**
 * VibeChat Room Management Server
 * Handles room creation, serving, and management
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.ROOM_SERVER_PORT || 3002;

// In-memory storage for active rooms (in production, use Redis/database)
const activeRooms = new Map();
const roomMetadata = new Map();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Room categories and templates
const ROOM_CATEGORIES = {
  'default': {
    name: 'General Chat',
    description: 'General purpose chat room',
    icon: '💬',
    color: '#6366f1'
  },
  'gaming': {
    name: 'Gaming',
    description: 'Gaming discussions and meetups',
    icon: '🎮',
    color: '#10b981'
  },
  'study': {
    name: 'Study Group',
    description: 'Collaborative learning space',
    icon: '📚',
    color: '#f59e0b'
  },
  'work': {
    name: 'Workspace',
    description: 'Professional collaboration',
    icon: '💼',
    color: '#8b5cf6'
  },
  'social': {
    name: 'Social Hub',
    description: 'Social gatherings and events',
    icon: '🎉',
    color: '#ec4899'
  }
};

// Generate unique room code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create new room
async function createRoom(roomData) {
  const roomCode = generateRoomCode();

  // Ensure uniqueness
  while (activeRooms.has(roomCode)) {
    roomCode = generateRoomCode();
  }

  const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const room = {
    id: roomId,
    code: roomCode,
    name: roomData.name || 'Untitled Room',
    description: roomData.description || '',
    category: roomData.category || 'default',
    creator: roomData.creator || 'anonymous',
    createdAt: new Date().toISOString(),
    isActive: true,
    maxMembers: roomData.maxMembers || 50,
    allowBots: roomData.allowBots !== false,
    isPublic: roomData.isPublic !== false,
    tags: roomData.tags || [],
    roomImage: roomData.roomImage || null,
    settings: {
      allowFileUploads: true,
      allowScreenShare: false,
      moderation: 'none',
      ...roomData.settings
    }
  };

  activeRooms.set(roomCode, room);
  roomMetadata.set(roomId, {
    messages: [],
    members: [],
    bots: [],
    lastActivity: new Date().toISOString()
  });

  // Save to file system
  await saveRoomToFile(room);

  return { room, roomCode };
}

// Save room data to file
async function saveRoomToFile(room) {
  const roomsDir = path.join(__dirname, 'rooms', 'active');
  await fs.mkdir(roomsDir, { recursive: true });

  const roomFile = path.join(roomsDir, `${room.code}.json`);
  await fs.writeFile(roomFile, JSON.stringify(room, null, 2));
}

// Load room from file
async function loadRoomFromFile(roomCode) {
  try {
    const roomFile = path.join(__dirname, 'rooms', 'active', `${roomCode}.json`);
    const data = await fs.readFile(roomFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Get all active rooms
function getActiveRooms() {
  return Array.from(activeRooms.values());
}

// Get room by code
function getRoomByCode(roomCode) {
  return activeRooms.get(roomCode) || null;
}

// Update room activity
function updateRoomActivity(roomCode) {
  const roomId = Array.from(activeRooms.entries())
    .find(([code, room]) => code === roomCode)?.[1]?.id;

  if (roomId && roomMetadata.has(roomId)) {
    roomMetadata.get(roomId).lastActivity = new Date().toISOString();
  }
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    activeRooms: activeRooms.size,
    uptime: process.uptime()
  });
});

// Get all active rooms
app.get('/api/rooms', (req, res) => {
  const rooms = getActiveRooms();
  res.json({
    success: true,
    rooms: rooms,
    count: rooms.length
  });
});

// Get room by code
app.get('/api/rooms/:roomCode', (req, res) => {
  const { roomCode } = req.params;
  const room = getRoomByCode(roomCode);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  updateRoomActivity(roomCode);
  res.json({
    success: true,
    room: room
  });
});

// Create new room
app.post('/api/rooms', async (req, res) => {
  try {
    const roomData = req.body;

    if (!roomData.name) {
      return res.status(400).json({
        success: false,
        message: 'Room name is required'
      });
    }

    const result = await createRoom(roomData);

    res.json({
      success: true,
      message: 'Room created successfully',
      room: result.room,
      roomCode: result.roomCode,
      roomUrl: `https://CoreVibeChatrooms.com/${result.roomCode}`
    });

  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room'
    });
  }
});

// Update room
app.put('/api/rooms/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const updates = req.body;

    const room = getRoomByCode(roomCode);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Update room data
    Object.keys(updates).forEach(key => {
      if (key in room) {
        room[key] = updates[key];
      }
    });

    room.updatedAt = new Date().toISOString();

    // Save updated room
    await saveRoomToFile(room);

    res.json({
      success: true,
      message: 'Room updated successfully',
      room: room
    });

  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room'
    });
  }
});

// Delete room
app.delete('/api/rooms/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = getRoomByCode(roomCode);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Remove from memory
    activeRooms.delete(roomCode);
    roomMetadata.delete(room.id);

    // Remove from file system
    const roomFile = path.join(__dirname, 'rooms', 'active', `${roomCode}.json`);
    try {
      await fs.unlink(roomFile);
    } catch (error) {
      console.warn('Could not delete room file:', error);
    }

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room'
    });
  }
});

// Get room categories
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    categories: ROOM_CATEGORIES
  });
});

// Serve room page
app.get('/room/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = getRoomByCode(roomCode);

    if (!room) {
      return res.status(404).send('Room not found');
    }

    updateRoomActivity(roomCode);

    // Serve room interface
    res.sendFile(path.join(__dirname, 'public', 'room-interface.html'));

  } catch (error) {
    console.error('Error serving room:', error);
    res.status(500).send('Internal server error');
  }
});

// WebSocket connection for real-time features
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', (ws, req) => {
  const roomCode = req.url.substring(1); // Remove leading '/'
  const room = getRoomByCode(roomCode);

  if (!room) {
    ws.close();
    return;
  }

  console.log(`WebSocket connection established for room: ${roomCode}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'join':
          handleUserJoin(ws, roomCode, data);
          break;
        case 'message':
          handleMessage(ws, roomCode, data);
          break;
        case 'leave':
          handleUserLeave(ws, roomCode, data);
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log(`WebSocket connection closed for room: ${roomCode}`);
  });
});

function handleUserJoin(ws, roomCode, data) {
  const room = getRoomByCode(roomCode);
  if (!room) return;

  updateRoomActivity(roomCode);

  // Broadcast user join to all clients in room
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify({
        type: 'user_joined',
        username: data.username,
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Send room info to new user
  ws.send(JSON.stringify({
    type: 'room_info',
    room: room,
    timestamp: new Date().toISOString()
  }));
}

function handleMessage(ws, roomCode, data) {
  const room = getRoomByCode(roomCode);
  if (!room) return;

  updateRoomActivity(roomCode);

  // Store message in room metadata
  const roomId = room.id;
  if (roomMetadata.has(roomId)) {
    const metadata = roomMetadata.get(roomId);
    metadata.messages.push({
      id: `msg_${Date.now()}`,
      username: data.username,
      content: data.content,
      timestamp: new Date().toISOString(),
      type: 'message'
    });

    // Keep only last 100 messages
    if (metadata.messages.length > 100) {
      metadata.messages = metadata.messages.slice(-100);
    }
  }

  // Broadcast message to all clients in room
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'new_message',
        username: data.username,
        content: data.content,
        timestamp: new Date().toISOString()
      }));
    }
  });
}

function handleUserLeave(ws, roomCode, data) {
  // Broadcast user leave to all clients in room
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify({
        type: 'user_left',
        username: data.username,
        timestamp: new Date().toISOString()
      }));
    }
  });
}

// Initialize default rooms
async function initializeDefaultRooms() {
  console.log('Initializing default rooms...');

  const defaultRooms = [
    {
      name: 'Welcome Room',
      description: 'Welcome to VibeChat! This is where new users get started.',
      category: 'default',
      creator: 'system',
      isPublic: true,
      tags: ['welcome', 'getting-started']
    },
    {
      name: 'General Chat',
      description: 'General discussion room for all topics.',
      category: 'default',
      creator: 'system',
      isPublic: true,
      tags: ['general', 'discussion']
    },
    {
      name: 'App Creators',
      description: 'Meet the creators and developers of VibeChat.',
      category: 'default',
      creator: 'system',
      isPublic: true,
      tags: ['creators', 'developers']
    },
    {
      name: 'Live Updates',
      description: 'Stay updated with the latest VibeChat news and features.',
      category: 'default',
      creator: 'system',
      isPublic: true,
      tags: ['updates', 'news']
    }
  ];

  for (const roomData of defaultRooms) {
    try {
      await createRoom(roomData);
      console.log(`Created default room: ${roomData.name}`);
    } catch (error) {
      console.error(`Failed to create room ${roomData.name}:`, error);
    }
  }
}

// Load existing rooms on startup
async function loadExistingRooms() {
  try {
    const roomsDir = path.join(__dirname, 'rooms', 'active');
    await fs.mkdir(roomsDir, { recursive: true });

    const files = await fs.readdir(roomsDir);
    const roomFiles = files.filter(file => file.endsWith('.json'));

    for (const file of roomFiles) {
      try {
        const roomCode = file.replace('.json', '');
        const roomData = await loadRoomFromFile(roomCode);

        if (roomData && roomData.isActive) {
          activeRooms.set(roomCode, roomData);
          console.log(`Loaded existing room: ${roomData.name} (${roomCode})`);
        }
      } catch (error) {
        console.error(`Failed to load room file ${file}:`, error);
      }
    }
  } catch (error) {
    console.log('No existing rooms found, will create defaults');
  }
}

// Cleanup inactive rooms
function cleanupInactiveRooms() {
  const now = new Date();
  const maxInactiveTime = 24 * 60 * 60 * 1000; // 24 hours

  for (const [roomCode, room] of activeRooms.entries()) {
    const roomId = room.id;
    const metadata = roomMetadata.get(roomId);

    if (metadata && metadata.lastActivity) {
      const lastActivity = new Date(metadata.lastActivity);
      const timeSinceActivity = now - lastActivity;

      if (timeSinceActivity > maxInactiveTime) {
        console.log(`Cleaning up inactive room: ${room.name}`);
        activeRooms.delete(roomCode);
        roomMetadata.delete(roomId);

        // Remove from file system
        const roomFile = path.join(__dirname, 'rooms', 'active', `${roomCode}.json`);
        fs.unlink(roomFile).catch(console.error);
      }
    }
  }
}

// Start server
async function startServer() {
  try {
    // Load existing rooms
    await loadExistingRooms();

    // Initialize default rooms if none exist
    if (activeRooms.size === 0) {
      await initializeDefaultRooms();
    }

    // Start cleanup interval (every hour)
    setInterval(cleanupInactiveRooms, 60 * 60 * 1000);

    app.listen(PORT, () => {
      console.log(`🚀 VibeChat Room Server running on port ${PORT}`);
      console.log(`📊 Active rooms: ${activeRooms.size}`);
      console.log(`🔗 Room URLs: http://localhost:${PORT}/room/:roomCode`);
      console.log(`📡 WebSocket: ws://localhost:3003/:roomCode`);
    });

  } catch (error) {
    console.error('Failed to start room server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { app, createRoom, getRoomByCode, getActiveRooms };
