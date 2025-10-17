import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Add as AddIcon,
  SmartToy as BotIcon,
  AdminPanelSettings as AdminIcon,
  DeveloperMode as DevIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
  Monitor as MonitorIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  requiresDeveloperMode?: boolean;
  requiresAdmin?: boolean;
}

const Navigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'My Rooms',
      icon: <ChatIcon />,
      path: '/rooms',
    },
    {
      text: 'Create Room',
      icon: <AddIcon />,
      path: '/rooms/create',
    },
    {
      text: 'My Bots',
      icon: <BotIcon />,
      path: '/bots',
    },
    {
      text: 'Create Bot',
      icon: <AddIcon />,
      path: '/bots/create',
    },
  ];

  // Admin navigation items
  const adminItems: NavigationItem[] = [
    {
      text: 'Admin Panel',
      icon: <AdminIcon />,
      path: '/admin',
      requiresAdmin: true,
    },
    {
      text: 'User Management',
      icon: <GroupIcon />,
      path: '/admin/users',
      requiresAdmin: true,
    },
    {
      text: 'System Monitor',
      icon: <MonitorIcon />,
      path: '/admin/monitor',
      requiresAdmin: true,
    },
  ];

  // Developer navigation items
  const developerItems: NavigationItem[] = [
    {
      text: 'Developer Mode',
      icon: <DevIcon />,
      path: '/developer',
      requiresDeveloperMode: true,
    },
    {
      text: 'API Playground',
      icon: <ApiIcon />,
      path: '/developer/api',
      requiresDeveloperMode: true,
    },
  ];

  // Filter items based on user permissions
  const getVisibleItems = (items: NavigationItem[]) => {
    return items.filter(item => {
      if (item.requiresAdmin && !user?.developerMode) return false;
      if (item.requiresDeveloperMode && !user?.developerMode) return false;
      return true;
    });
  };

  const visibleNavItems = getVisibleItems(navigationItems);
  const visibleAdminItems = getVisibleItems(adminItems);
  const visibleDevItems = getVisibleItems(developerItems);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Drawer content
  const drawerContent = (
    <Box sx={{ width: 280, pt: 2 }}>
      {/* User Profile Section */}
      <Box sx={{ px: 2, pb: 2, mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
        </Box>

        {/* User Status Badges */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {user?.emailVerified && (
            <Chip label="Verified" size="small" color="success" variant="outlined" />
          )}
          {user?.developerMode && (
            <Chip label="Developer" size="small" color="warning" variant="outlined" />
          )}
        </Box>
      </Box>

      {/* Main Navigation */}
      <List className="navigation-menu">
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
          Main
        </Typography>

        {visibleNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActiveRoute(item.path)}
              className={item.path === '/bots/create' ? 'create-bot-nav' : ''}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.badge && (
                <Badge badgeContent={item.badge} color="error" />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Admin Section */}
      {visibleAdminItems.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <List>
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
              Administration
            </Typography>

            {visibleAdminItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActiveRoute(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'error.main',
                      color: 'error.contrastText',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'error.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Developer Section */}
      {visibleDevItems.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <List>
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
              Development
            </Typography>

            {visibleDevItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActiveRoute(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'warning.main',
                      color: 'warning.contrastText',
                      '&:hover': {
                        backgroundColor: 'warning.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'warning.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Bottom Section */}
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItemButton
          onClick={() => handleNavigation('/developer')}
          sx={{
            borderRadius: 1,
            backgroundColor: user?.developerMode ? 'warning.light' : 'transparent',
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            onClick={() => handleNavigation('/dashboard')}
          >
            VibeChat
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {visibleNavItems.slice(0, 4).map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  variant={isActiveRoute(item.path) ? 'outlined' : 'text'}
                  size="small"
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <IconButton color="inherit">
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              className="profile-menu"
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{ p: 0.5 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleNavigation('/developer')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/developer')}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        {user?.developerMode && (
          <MenuItem onClick={() => handleNavigation('/developer')}>
            <ListItemIcon>
              <DevIcon fontSize="small" />
            </ListItemIcon>
            Developer Mode
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navigation;
