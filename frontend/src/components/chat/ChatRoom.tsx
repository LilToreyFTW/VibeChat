import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  Palette as PaletteIcon,
  MoreVert as MoreVertIcon,
  EmojiEmotions as EmojiIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRoomStore } from '../../store/roomStore';
import { useChatStore } from '../../store/chatStore';
import { ChatMessage, Room } from '../../types';
import webSocketService from '../../services/websocket';
import apiService from '../../services/api';

interface OnlineUser {
  username: string;
  joinedAt: string;
}

const ChatRoom: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRoom, fetchRoomByCode } = useRoomStore();
  const { messages, isConnected, addMessage } = useChatStore();

  // Local state
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [imageUploadDialog, setImageUploadDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (roomCode && user) {
      // Fetch room details
      fetchRoomByCode(roomCode);

      // Connect to WebSocket
      webSocketService.connect(roomCode, handleIncomingMessage);

      // Join the room
      webSocketService.joinRoom(roomCode, user.username);

      return () => {
        webSocketService.disconnect();
      };
    }
  }, [roomCode, user, fetchRoomByCode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleIncomingMessage = (message: ChatMessage) => {
    addMessage(message);

    // Handle user join/leave for online users list
    if (message.type === 'JOIN') {
      setOnlineUsers(prev => {
        if (!prev.find(u => u.username === message.sender)) {
          return [...prev, { username: message.sender, joinedAt: message.timestamp }];
        }
        return prev;
      });
    } else if (message.type === 'LEAVE') {
      setOnlineUsers(prev => prev.filter(u => u.username !== message.sender));
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !roomCode || !user) return;

    const message: ChatMessage = {
      type: 'CHAT',
      content: messageInput.trim(),
      sender: user.username,
      timestamp: new Date().toISOString(),
      roomCode,
    };

    webSocketService.sendMessage(roomCode, message);
    setMessageInput('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && roomCode) {
      // Handle file upload logic here
      setSnackbar({ open: true, message: 'File upload not yet implemented', severity: 'success' });
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
    setImageUploadDialog(false);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setSnackbar({ open: true, message: 'Room code copied to clipboard!', severity: 'success' });
    }
    handleCloseContextMenu();
  };

  const handleShareRoom = () => {
    if (roomCode) {
      const shareUrl = `https://CoreVibeChatrooms.com/${roomCode}`;
      navigator.clipboard.writeText(shareUrl);
      setSnackbar({ open: true, message: 'Room link copied to clipboard!', severity: 'success' });
    }
    handleCloseContextMenu();
  };

  const handleLeaveRoom = () => {
    if (roomCode && user) {
      const leaveMessage: ChatMessage = {
        type: 'LEAVE',
        content: `${user.username} left the room`,
        sender: user.username,
        timestamp: new Date().toISOString(),
        roomCode,
      };

      webSocketService.sendMessage(roomCode, leaveMessage);
      webSocketService.disconnect();
      navigate('/dashboard');
    }
    handleCloseContextMenu();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString();
  };

  const getMessageAvatar = (sender: string) => {
    if (sender === 'System') return '🤖';
    if (sender === user?.username) return '👤';
    return '👥';
  };

  if (!currentRoom) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading room...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 0 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={currentRoom.roomImage} sx={{ width: 48, height: 48 }}>
              {currentRoom.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h1">
                {currentRoom.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Room Code: {roomCode} • {onlineUsers.length} online
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={<PeopleIcon />}
              label={`${onlineUsers.length} online`}
              color="primary"
              variant="outlined"
            />
            <Tooltip title="Room Settings">
              <IconButton onClick={() => setSettingsDialog(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More Options">
              <IconButton onClick={handleContextMenu}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Leave Room">
              <IconButton onClick={handleLeaveRoom} color="error">
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Main Chat Area */}
      <Box display="flex" flex={1} overflow="hidden">
        {/* Messages Area */}
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
          {/* Messages List */}
          <Box flex={1} overflow="auto" p={2} sx={{ backgroundColor: '#fafafa' }}>
            <List>
              {messages.map((message, index) => {
                const isSystemMessage = message.type === 'JOIN' || message.type === 'LEAVE';
                const isOwnMessage = message.sender === user?.username;

                return (
                  <ListItem
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    {isSystemMessage ? (
                      <Chip
                        label={`${message.content} • ${formatTimestamp(message.timestamp)}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          fontSize: '0.75rem',
                          height: '24px'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          maxWidth: '70%',
                          flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                        }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {getMessageAvatar(message.sender)}
                        </Avatar>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            backgroundColor: isOwnMessage ? 'primary.main' : 'background.paper',
                            color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
                            borderRadius: 2,
                          }}
                        >
                          {!isOwnMessage && (
                            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                              {message.sender}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              opacity: 0.7,
                              fontSize: '0.7rem'
                            }}
                          >
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </ListItem>
                );
              })}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
            <Box display="flex" gap={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Attach file">
                        <IconButton size="small" onClick={() => fileInputRef.current?.click()}>
                          <AttachFileIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send image">
                        <IconButton size="small" onClick={() => setImageUploadDialog(true)}>
                          <ImageIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !isConnected}
                sx={{ height: 56, px: 3 }}
              >
                <SendIcon />
              </Button>
            </Box>
            {!isConnected && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Disconnected from server. Trying to reconnect...
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Online Users Sidebar */}
        <Paper elevation={2} sx={{ width: 250, display: 'flex', flexDirection: 'column' }}>
          <Box p={2} borderBottom="1px solid" borderColor="divider">
            <Typography variant="h6" gutterBottom>
              Online Users ({onlineUsers.length})
            </Typography>
          </Box>
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {onlineUsers.map((user) => (
              <ListItem key={user.username}>
                <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={user.username}
                  secondary={`Joined ${formatDate(user.joinedAt)}`}
                />
              </ListItem>
            ))}
            {onlineUsers.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No users online"
                  secondary="Users will appear here when they join"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuItem onClick={handleCopyRoomCode}>
          <ContentCopyIcon sx={{ mr: 1 }} />
          Copy Room Code
        </MenuItem>
        <MenuItem onClick={handleShareRoom}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Room Link
        </MenuItem>
        <MenuItem onClick={() => setInviteDialog(true)}>
          <PeopleIcon sx={{ mr: 1 }} />
          Invite Users
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setSettingsDialog(true)}>
          <SettingsIcon sx={{ mr: 1 }} />
          Room Settings
        </MenuItem>
        <MenuItem onClick={handleLeaveRoom}>
          <ExitToAppIcon sx={{ mr: 1 }} />
          Leave Room
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Room Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Room Information
                  </Typography>
                  <Typography>Name: {currentRoom.name}</Typography>
                  <Typography>Description: {currentRoom.description || 'No description'}</Typography>
                  <Typography>Created: {formatDate(currentRoom.createdAt)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Room Actions
                  </Typography>
                  <Button fullWidth variant="outlined" sx={{ mb: 1 }}>
                    Change Room Image
                  </Button>
                  <Button fullWidth variant="outlined" sx={{ mb: 1 }}>
                    Edit Room Details
                  </Button>
                  <Button fullWidth variant="outlined" color="error">
                    Delete Room
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteDialog} onClose={() => setInviteDialog(false)}>
        <DialogTitle>Invite Users</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Share this link with others to invite them to your room:
          </Typography>
          <TextField
            fullWidth
            value={`https://CoreVibeChatrooms.com/${roomCode}`}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copy to clipboard">
                    <IconButton onClick={() => navigator.clipboard.writeText(`https://CoreVibeChatrooms.com/${roomCode}`)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={imageUploadDialog} onClose={() => setImageUploadDialog(false)}>
        <DialogTitle>Upload Room Image</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select an image to set as your room's avatar:
          </Typography>
          <Button variant="outlined" onClick={handleImageUpload} fullWidth>
            Choose Image
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageUploadDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChatRoom;
