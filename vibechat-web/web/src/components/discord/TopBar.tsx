import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as BellIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';

interface TopBarProps {
  onSettingsClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSettingsClick }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box
      sx={{
        height: 48,
        backgroundColor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2,
      }}
    >
      {/* Logo/Brand */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          V
        </Box>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          VibeChat
        </Typography>
      </Box>

      {/* Server/Channel Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gaming Hub
        </Typography>
        <ExpandIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          #general
        </Typography>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Search Bar */}
      <TextField
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        sx={{
          width: 240,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.default',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
            },
          },
          '& .MuiInputBase-input': {
            py: 0.75,
            fontSize: '0.875rem',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Right Side Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={3} color="error">
              <BellIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Avatar & Status */}
        <Tooltip title="YourUsername — Online">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                Y
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#23a559', // Online green
                  border: '2px solid',
                  borderColor: 'background.paper',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
              YourUsername
            </Typography>
            <ExpandIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
          </Box>
        </Tooltip>

        {/* Settings */}
        <Tooltip title="User Settings">
          <IconButton onClick={onSettingsClick} sx={{ color: 'text.secondary' }}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TopBar;
