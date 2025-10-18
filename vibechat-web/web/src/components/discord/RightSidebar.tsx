import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

interface RightSidebarProps {
  selectedServer: string;
  selectedChannel: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedServer, selectedChannel }) => {
  const theme = useTheme();

  // Mock member data - in real app, this would come from API/state
  const members = [
    { id: '1', name: 'Alice', role: 'admin', status: 'online', avatar: 'A', inVoice: true },
    { id: '2', name: 'Bob', role: 'moderator', status: 'idle', avatar: 'B', inVoice: false },
    { id: '3', name: 'Carol', role: 'member', status: 'dnd', avatar: 'C', inVoice: true },
    { id: '4', name: 'David', role: 'member', status: 'offline', avatar: 'D', inVoice: false },
    { id: '5', name: 'Eve', role: 'member', status: 'online', avatar: 'E', inVoice: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#23a559';
      case 'idle': return '#f0b232';
      case 'dnd': return '#f23f42';
      default: return '#80848e';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#f1c40f'; // Gold
      case 'moderator': return '#3498db'; // Blue
      default: return '#95a5a6'; // Gray
    }
  };

  const onlineCount = members.filter(m => m.status === 'online').length;
  const totalMembers = members.length;

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: 'background.paper',
        borderLeft: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Members — {onlineCount}/{totalMembers}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Member Settings">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <MoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hide Members">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Members List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {members.map((member) => (
            <ListItem key={member.id} sx={{ px: 2, py: 1 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: member.role === 'admin' ? '#f1c40f' : '#5865f2',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(member.status),
                      border: '2px solid',
                      borderColor: 'background.paper',
                    }}
                  />
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        fontWeight: member.role === 'admin' ? 600 : 400,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: member.inVoice ? '#23a559' : 'transparent',
                        border: member.inVoice ? 'none' : '1px solid #80848e',
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {member.role}
                  </Typography>
                }
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiListItemText-secondary': {
                    fontSize: '0.75rem',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Voice Channel Users (if in voice) */}
      {selectedChannel === 'general-voice' && (
        <>
          <Divider sx={{ mx: 2, my: 1 }} />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              General — 3
            </Typography>
            <List sx={{ py: 0 }}>
              {members
                .filter(member => member.inVoice)
                .map((member) => (
                  <ListItem key={`voice-${member.id}`} sx={{ px: 1, py: 0.5 }}>
                    <ListItemAvatar sx={{ minWidth: 24 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: getRoleColor(member.role),
                          fontSize: '0.75rem',
                        }}
                      >
                        {member.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.75rem',
                          color: 'text.primary',
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      <IconButton size="small" sx={{ p: 0.25 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                          🔇
                        </Typography>
                      </IconButton>
                      <IconButton size="small" sx={{ p: 0.25 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                          🔈
                        </Typography>
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
};

export default RightSidebar;
