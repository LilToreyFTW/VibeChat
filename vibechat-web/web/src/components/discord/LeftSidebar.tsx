import React from 'react';
import {
  Box,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Explore as ExploreIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Inbox as InboxIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

interface LeftSidebarProps {
  selectedServer: string;
  onServerSelect: (serverId: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ selectedServer, onServerSelect }) => {
  const theme = useTheme();

  // Mock server data - in real app, this would come from API/state
  const servers = [
    { id: 'home', name: 'Home', icon: '🏠', memberCount: 0, unread: false },
    { id: 'server1', name: 'Gaming Hub', icon: '🎮', memberCount: 1247, unread: true },
    { id: 'server2', name: 'Dev Community', icon: '💻', memberCount: 892, unread: false },
    { id: 'server3', name: 'Music Lovers', icon: '🎵', memberCount: 567, unread: false },
    { id: 'server4', name: 'Art & Design', icon: '🎨', memberCount: 334, unread: true },
  ];

  const dms = [
    { id: 'dm1', name: 'Alice', status: 'online', unread: 2 },
    { id: 'dm2', name: 'Bob', status: 'idle', unread: 0 },
    { id: 'dm3', name: 'Carol', status: 'dnd', unread: 1 },
    { id: 'dm4', name: 'David', status: 'offline', unread: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#23a559';
      case 'idle': return '#f0b232';
      case 'dnd': return '#f23f42';
      default: return '#80848e';
    }
  };

  return (
    <Box
      sx={{
        width: 72,
        backgroundColor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1,
        overflow: 'hidden',
      }}
    >
      {/* Server Icons */}
      <Box sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        <List sx={{ py: 0 }}>
          {servers.map((server) => (
            <ListItem key={server.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={server.name} placement="right">
                <ListItemButton
                  onClick={() => onServerSelect(server.id)}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    mx: 'auto',
                    backgroundColor: selectedServer === server.id
                      ? theme.palette.primary.main
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: selectedServer === server.id
                        ? theme.palette.primary.main
                        : theme.palette.action.hover,
                      borderRadius: '16px',
                    },
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                    {server.icon}
                  </Typography>
                  {server.unread && (
                    <Badge
                      color="error"
                      variant="dot"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        '& .MuiBadge-badge': {
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          minWidth: 8,
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}

          {/* Add Server Button */}
          <ListItem disablePadding sx={{ mt: 1 }}>
            <Tooltip title="Add a Server" placement="right">
              <ListItemButton
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  mx: 'auto',
                  backgroundColor: 'transparent',
                  border: `2px dashed ${theme.palette.divider}`,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ color: theme.palette.text.secondary }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>

          {/* Explore Public Servers */}
          <ListItem disablePadding sx={{ mt: 1 }}>
            <Tooltip title="Explore Public Servers" placement="right">
              <ListItemButton
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  mx: 'auto',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ExploreIcon sx={{ color: theme.palette.text.secondary }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ width: '32px', my: 1 }} />

      {/* Direct Messages Section */}
      <Box sx={{ width: '100%', px: 1 }}>
        <Tooltip title="Direct Messages" placement="right">
          <ListItemButton
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              mx: 'auto',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: '16px',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <InboxIcon sx={{ color: theme.palette.text.secondary }} />
          </ListItemButton>
        </Tooltip>

        {/* DM List */}
        <List sx={{ py: 0, maxHeight: '200px', overflow: 'hidden' }}>
          {dms.slice(0, 3).map((dm) => (
            <ListItem key={dm.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={`${dm.name} (${dm.status})`} placement="right">
                <ListItemButton
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    mx: 'auto',
                    backgroundColor: 'transparent',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(dm.status),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {dm.name.charAt(0)}
                  </Box>
                  {dm.unread > 0 && (
                    <Badge
                      badgeContent={dm.unread}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          minWidth: '12px',
                          height: '12px',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ width: '32px', my: 1 }} />

      {/* Bottom Quick Access */}
      <Box sx={{ width: '100%', px: 1 }}>
        <Tooltip title="Friends" placement="right">
          <IconButton
            sx={{
              width: 32,
              height: 32,
              mx: 'auto',
              mb: 1,
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary,
              },
            }}
          >
            <PeopleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="B00ST+" placement="right">
          <IconButton
            sx={{
              width: 32,
              height: 32,
              mx: 'auto',
              mb: 1,
              color: '#f47b67', // Nitro color
              '&:hover': {
                backgroundColor: 'rgba(244, 123, 103, 0.1)',
              },
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              +
            </Typography>
          </IconButton>
        </Tooltip>

        <Tooltip title="Settings" placement="right">
          <IconButton
            sx={{
              width: 32,
              height: 32,
              mx: 'auto',
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary,
              },
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default LeftSidebar;
