import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Tag as HashIcon,
  VolumeUp as VoiceIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Pin as PinIcon,
} from '@mui/icons-material';

interface CentralPaneProps {
  selectedServer: string;
  selectedChannel: string;
  onChannelSelect: (channelId: string) => void;
  onToggleRightSidebar: () => void;
}

const CentralPane: React.FC<CentralPaneProps> = ({
  selectedServer,
  selectedChannel,
  onChannelSelect,
  onToggleRightSidebar,
}) => {
  const theme = useTheme();

  // Mock channel data - in real app, this would come from API/state
  const channels = {
    textChannels: [
      { id: 'general', name: 'general', unread: 3, mentions: 1 },
      { id: 'random', name: 'random', unread: 0, mentions: 0 },
      { id: 'announcements', name: 'announcements', unread: 1, mentions: 0 },
      { id: 'memes', name: 'memes', unread: 5, mentions: 2 },
    ],
    voiceChannels: [
      { id: 'general-voice', name: 'General', users: 3 },
      { id: 'gaming', name: 'Gaming', users: 0 },
      { id: 'music', name: 'Music', users: 2 },
    ],
  };

  const messages = [
    {
      id: '1',
      author: 'Alice',
      avatar: 'A',
      timestamp: '2:30 PM',
      content: 'Hey everyone! How\'s it going?',
      reactions: [{ emoji: '👍', count: 3 }, { emoji: '❤️', count: 1 }],
      isOwn: false,
    },
    {
      id: '2',
      author: 'You',
      avatar: 'Y',
      timestamp: '2:32 PM',
      content: 'Great! Just working on some new features for the app.',
      reactions: [{ emoji: '🚀', count: 2 }],
      isOwn: true,
    },
    {
      id: '3',
      author: 'Bob',
      avatar: 'B',
      timestamp: '2:35 PM',
      content: 'That sounds awesome! Can\'t wait to see what you\'ve built.',
      reactions: [{ emoji: '👀', count: 1 }],
      isOwn: false,
    },
  ];

  const renderMessage = (message: any) => (
    <Box
      key={message.id}
      sx={{
        display: 'flex',
        px: 2,
        py: 1,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
        },
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: message.isOwn ? theme.palette.primary.main : '#5865f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: 'white',
          flexShrink: 0,
        }}
      >
        {message.avatar}
      </Box>

      {/* Message Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: message.isOwn ? 'inherit' : '#00aff4',
              fontWeight: 500,
            }}
          >
            {message.author}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {message.timestamp}
          </Typography>
        </Box>

        {/* Message Text */}
        <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
          {message.content}
        </Typography>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            {message.reactions.map((reaction: any, index: number) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  px: 1,
                  py: 0.25,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Typography sx={{ mr: 0.5 }}>{reaction.emoji}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {reaction.count}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        backgroundColor: 'background.default',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Channel Sidebar */}
      <Box
        sx={{
          width: 240,
          backgroundColor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Channel Header */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {selectedServer === 'home' ? 'Direct Messages' : 'Gaming Hub'}
          </Typography>
        </Box>

        {/* Text Channels */}
        <Box>
          <Typography
            variant="overline"
            sx={{
              px: 2,
              py: 1,
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Text Channels
          </Typography>
          <List sx={{ py: 0 }}>
            {channels.textChannels.map((channel) => (
              <ListItem key={channel.id} disablePadding>
                <ListItemButton
                  onClick={() => onChannelSelect(channel.id)}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: selectedChannel === channel.id
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
                    <HashIcon sx={{ color: 'text.secondary', fontSize: '1.125rem' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={channel.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                  {channel.unread > 0 && (
                    <Badge
                      badgeContent={channel.unread}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          minWidth: '16px',
                          height: '16px',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Voice Channels */}
        <Box>
          <Typography
            variant="overline"
            sx={{
              px: 2,
              py: 1,
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Voice Channels
          </Typography>
          <List sx={{ py: 0 }}>
            {channels.voiceChannels.map((channel) => (
              <ListItem key={channel.id} disablePadding>
                <ListItemButton
                  sx={{
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
                    <VoiceIcon sx={{ color: 'text.secondary', fontSize: '1.125rem' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={channel.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                  {channel.users > 0 && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {channel.users}
                    </Typography>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* User Info */}
        <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Y
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                YourUsername
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Online
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Mute">
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <Typography variant="caption">🔇</Typography>
                </IconButton>
              </Tooltip>
              <Tooltip title="Deafen">
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <Typography variant="caption">🔈</Typography>
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Channel Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HashIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              {selectedChannel}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Welcome to the beginning of the #{selectedChannel} channel.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Pinned Messages">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <PinIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Members">
              <IconButton
                size="small"
                sx={{ color: 'text.secondary' }}
                onClick={onToggleRightSidebar}
              >
                <PeopleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 0,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
            },
          }}
        >
          {messages.map(renderMessage)}
        </Box>
      </Box>
    </Box>
  );
};

export default CentralPane;
