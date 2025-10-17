import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Monitor as MonitorIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  SmartToy as BotIcon,
  MeetingRoom as RoomIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRooms: number;
  activeRooms: number;
  totalBots: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRooms: 0,
    activeRooms: 0,
    totalBots: 0,
    systemHealth: 'healthy',
    uptime: '0d 0h 0m',
    memoryUsage: 0,
    cpuUsage: 0,
  });

  useEffect(() => {
    // Simulate fetching system stats
    const fetchStats = () => {
      setStats({
        totalUsers: 1247,
        activeUsers: 342,
        totalRooms: 89,
        activeRooms: 67,
        totalBots: 45,
        systemHealth: 'healthy',
        uptime: '7d 14h 32m',
        memoryUsage: 68,
        cpuUsage: 23,
      });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckIcon />;
      case 'warning': return <WarningIcon />;
      case 'critical': return <ErrorIcon />;
      default: return <AdminIcon />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AdminIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Control Panel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              System administration and monitoring dashboard
            </Typography>
          </Box>
        </Box>

        {/* System Status Alert */}
        <Alert
          severity={stats.systemHealth === 'healthy' ? 'success' : stats.systemHealth === 'warning' ? 'warning' : 'error'}
          sx={{ mb: 4 }}
          icon={getHealthIcon(stats.systemHealth)}
        >
          <Typography variant="body1">
            <strong>System Status:</strong> {stats.systemHealth.toUpperCase()}
          </Typography>
          <Typography variant="body2">
            All systems operational • Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Alert>

        {/* Main Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {stats.totalUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography color="text.secondary" gutterBottom>
                    Active Users
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {stats.activeUsers}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Online now
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <RoomIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography color="text.secondary" gutterBottom>
                    Total Rooms
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {stats.totalRooms}
                </Typography>
                <Typography variant="body2" color="info.main">
                  {stats.activeRooms} active
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BotIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography color="text.secondary" gutterBottom>
                    Total Bots
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {stats.totalBots}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  AI assistants active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Performance Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MonitorIcon />
                  System Performance
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">CPU Usage</Typography>
                      <Typography variant="body2">{stats.cpuUsage}%</Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                      <Box
                        sx={{
                          width: `${stats.cpuUsage}%`,
                          bgcolor: stats.cpuUsage > 80 ? 'error.main' : stats.cpuUsage > 60 ? 'warning.main' : 'success.main',
                          height: '100%',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Memory Usage</Typography>
                      <Typography variant="body2">{stats.memoryUsage}%</Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                      <Box
                        sx={{
                          width: `${stats.memoryUsage}%`,
                          bgcolor: stats.memoryUsage > 80 ? 'error.main' : stats.memoryUsage > 60 ? 'warning.main' : 'success.main',
                          height: '100%',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">System Uptime</Typography>
                    <Chip label={stats.uptime} color="success" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon />
                  Quick Actions
                </Typography>

                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/admin/users')}>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary="User Management" secondary="Manage user accounts and permissions" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/admin/monitor')}>
                      <ListItemIcon>
                        <MonitorIcon />
                      </ListItemIcon>
                      <ListItemText primary="System Monitor" secondary="Real-time system performance" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <SecurityIcon />
                      </ListItemIcon>
                      <ListItemText primary="Security Center" secondary="Access logs and security settings" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="System Settings" secondary="Configure system parameters" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon />
              Recent Activity
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { time: '2 minutes ago', action: 'New user registered', type: 'user' },
                { time: '5 minutes ago', action: 'Room "Gaming Central" created', type: 'room' },
                { time: '12 minutes ago', action: 'Bot "Chat Moderator" deployed', type: 'bot' },
                { time: '18 minutes ago', action: 'System backup completed', type: 'system' },
                { time: '25 minutes ago', action: 'User "john_doe" logged in', type: 'user' },
              ].map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 1, bgcolor: 'grey.50' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {activity.type === 'user' && <PeopleIcon />}
                    {activity.type === 'room' && <RoomIcon />}
                    {activity.type === 'bot' && <BotIcon />}
                    {activity.type === 'system' && <SettingsIcon />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">{activity.action}</Typography>
                    <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminPanel;
