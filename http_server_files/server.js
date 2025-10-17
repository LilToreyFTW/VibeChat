require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:", "http:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Backend API base URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api';

// Store active rooms and their connections
const activeRooms = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle room joining
  socket.on('join-room', async (data) => {
    try {
      const { roomCode, username } = data;

      // Validate room exists
      const roomResponse = await axios.get(`${BACKEND_URL}/rooms/${roomCode}`);
      if (!roomResponse.data.success) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const room = roomResponse.data.room;

      // Leave previous room if any
      if (socket.roomCode) {
        socket.leave(socket.roomCode);
        if (activeRooms.has(socket.roomCode)) {
          const roomUsers = activeRooms.get(socket.roomCode);
          roomUsers.delete(socket.id);
          if (roomUsers.size === 0) {
            activeRooms.delete(socket.roomCode);
          }
        }
      }

      // Join new room
      socket.roomCode = roomCode;
      socket.username = username;
      socket.join(roomCode);

      // Track active users in room
      if (!activeRooms.has(roomCode)) {
        activeRooms.set(roomCode, new Set());
      }
      activeRooms.get(roomCode).add(socket.id);

      // Send room info to user
      socket.emit('room-joined', {
        room: room,
        onlineUsers: Array.from(activeRooms.get(roomCode)).length
      });

      // Notify other users in room
      socket.to(roomCode).emit('user-joined', {
        username,
        onlineUsers: activeRooms.get(roomCode).size
      });

      console.log(`${username} joined room ${roomCode}`);

    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    const { roomCode, message } = data;

    if (socket.roomCode === roomCode) {
      // Broadcast to all users in room except sender
      socket.to(roomCode).emit('new-message', {
        ...message,
        timestamp: new Date().toISOString()
      });

      // Also send back to sender for confirmation
      socket.emit('message-sent', message);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { roomCode, isTyping } = data;
    socket.to(roomCode).emit('user-typing', {
      username: socket.username,
      isTyping
    });
  });

  // Handle file uploads (placeholder)
  socket.on('upload-file', (data) => {
    const { roomCode, fileInfo } = data;
    // Broadcast file upload to room
    socket.to(roomCode).emit('file-uploaded', {
      ...fileInfo,
      uploadedBy: socket.username,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (socket.roomCode && socket.username) {
      // Remove from active users
      if (activeRooms.has(socket.roomCode)) {
        const roomUsers = activeRooms.get(socket.roomCode);
        roomUsers.delete(socket.id);

        // Notify other users
        socket.to(socket.roomCode).emit('user-left', {
          username: socket.username,
          onlineUsers: roomUsers.size
        });

        // Clean up empty rooms
        if (roomUsers.size === 0) {
          activeRooms.delete(socket.roomCode);
        }
      }
    }
  });
});

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    activeRooms: activeRooms.size
  });
});

// Get room info by code
app.get('/api/room/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const response = await axios.get(`${BACKEND_URL}/rooms/${roomCode}`);

    if (response.data.success) {
      res.json(response.data);
    } else {
      res.status(404).json({ success: false, message: 'Room not found' });
    }
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get active rooms count
app.get('/api/rooms/active', (req, res) => {
  res.json({
    success: true,
    activeRooms: activeRooms.size,
    rooms: Array.from(activeRooms.keys())
  });
});

// Serve static files for room pages
app.use(express.static(path.join(__dirname, 'public')));

// Room page route - serves the chat interface
app.get('/room/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;

    // Validate room exists
    const roomResponse = await axios.get(`${BACKEND_URL}/rooms/${roomCode}`);

    if (roomResponse.data.success) {
      // Serve the room page
      res.sendFile(path.join(__dirname, 'public', 'room.html'));
    } else {
      res.status(404).send('Room not found');
    }
  } catch (error) {
    console.error('Error serving room page:', error);
    res.status(500).send('Internal server error');
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 VibeChat Room Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔗 Room URLs: http://localhost:${PORT}/room/:roomCode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
