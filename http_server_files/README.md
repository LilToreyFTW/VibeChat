# VibeChat Room Server

This is the HTTP server that serves room pages and handles live chat functionality for VibeChat.

## Features

- **Room Page Serving**: Serves chat interfaces at URLs like `https://CoreVibeChatrooms.com/ROOMCODE`
- **Real-time Chat**: Socket.IO powered real-time messaging
- **Room Validation**: Validates room codes against the backend API
- **User Management**: Tracks online users and handles join/leave events
- **Responsive Design**: Mobile-friendly chat interface
- **Security**: Rate limiting, CORS protection, and input sanitization

## Setup

1. **Install Dependencies**
   ```bash
   cd http_server_files
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `BACKEND_URL` | Backend API URL | `http://localhost:8080/api` |
| `ROOM_CODE_LENGTH` | Length of generated room codes | `8` |
| `ROOM_BASE_URL` | Base URL for room links | `https://CoreVibeChatrooms.com` |

## API Endpoints

- `GET /health` - Server health check
- `GET /api/room/:roomCode` - Get room information
- `GET /api/rooms/active` - Get active rooms count
- `GET /room/:roomCode` - Serve room chat page

## Socket.IO Events

### Client → Server
- `join-room` - Join a chat room
- `send-message` - Send a chat message
- `typing` - Typing indicator
- `upload-file` - File upload (placeholder)

### Server → Client
- `room-joined` - Room joined successfully
- `user-joined` - New user joined
- `user-left` - User left the room
- `new-message` - New chat message
- `message-sent` - Message sent confirmation
- `error` - Error message

## Architecture

```
http_server_files/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── public/
│   └── room.html     # Room chat interface
└── README.md         # This file
```

## Development

The server uses:
- **Express.js** for HTTP routing
- **Socket.IO** for real-time communication
- **Axios** for backend API calls
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Morgan** for HTTP request logging

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Set up reverse proxy (nginx recommended)
4. Enable HTTPS
5. Configure proper logging
6. Set up monitoring and health checks

## Integration

This server integrates with:
- **VibeChat Backend API** (Java Spring Boot)
- **VibeChat Frontend** (React TypeScript)
- **Room Management System**

The server acts as a bridge between the static room URLs and the dynamic backend API, providing real-time communication capabilities.
