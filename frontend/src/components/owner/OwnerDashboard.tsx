import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Block,
  CheckCircle,
  Warning,
  Search,
  FilterList,
  Download,
  Refresh
} from '@mui/icons-material';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newUsersToday: number;
  totalRevenue: number;
  systemUptime: string;
  serverStatus: {
    backend: boolean;
    frontend: boolean;
    aiService: boolean;
    roomServer: boolean;
  };
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  permissions: string[];
  subscriptionTier: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
}

interface OwnerDashboardProps {
  owner: any;
  onLogout: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ owner, onLogout }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load dashboard stats
      const statsResult = await (window as any).electronAPI.ownerDashboardStats();
      setStats(statsResult);

      // Load user management data
      const usersResult = await (window as any).electronAPI.ownerUserManagement({
        searchQuery,
        filterRole,
        filterStatus
      });
      setUsers(usersResult.users);

    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      const result = await (window as any).electronAPI.ownerBanUser(userId, reason);
      if (result.success) {
        loadDashboardData();
        setBanDialogOpen(false);
        setBanReason('');
      } else {
        setError(result.error || 'Failed to ban user');
      }
    } catch (error) {
      setError('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const result = await (window as any).electronAPI.ownerUnbanUser(userId);
      if (result.success) {
        loadDashboardData();
      } else {
        setError(result.error || 'Failed to unban user');
      }
    } catch (error) {
      setError('Failed to unban user');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const result = await (window as any).electronAPI.ownerUpdateUserRole(userId, newRole);
      if (result.success) {
        loadDashboardData();
      } else {
        setError(result.error || 'Failed to update user role');
      }
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleExportData = async () => {
    try {
      const result = await (window as any).electronAPI.ownerExportData();
      if (result.success) {
        // Create and download the data file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vibechat-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        setError(result.error || 'Failed to export data');
      }
    } catch (error) {
      setError('Failed to export data');
    }
  };

  const getStatusColor = (isActive: boolean, isBanned: boolean) => {
    if (isBanned) return 'error';
    if (isActive) return 'success';
    return 'warning';
  };

  const getStatusText = (isActive: boolean, isBanned: boolean) => {
    if (isBanned) return 'Banned';
    if (isActive) return 'Active';
    return 'Inactive';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          🎛️ Owner Control Panel
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportData}
            sx={{ mr: 2 }}
          >
            Export Data
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.activeUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Banned Users
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.bannedUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  New Today
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {stats.newUsersToday}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="User Management" />
          <Tab label="System Status" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {/* User Management Tab */}
      {activeTab === 0 && (
        <Paper>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="ALL">All Roles</MenuItem>
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="MODERATOR">Moderator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="ALL">All Status</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="BANNED">Banned</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={loadDashboardData}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'ADMIN' ? 'error' : user.role === 'MODERATOR' ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(user.isActive, user.isBanned)}
                        color={getStatusColor(user.isActive, user.isBanned)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.subscriptionTier}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          setBanDialogOpen(true);
                        }}
                        disabled={user.isBanned}
                      >
                        <Block color="error" />
                      </IconButton>
                      {user.isBanned && (
                        <IconButton
                          size="small"
                          onClick={() => handleUnbanUser(user.id)}
                        >
                          <CheckCircle color="success" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* System Status Tab */}
      {activeTab === 1 && stats && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Server Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>Backend API:</Typography>
                  <Chip
                    label={stats.serverStatus.backend ? 'Online' : 'Offline'}
                    color={stats.serverStatus.backend ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>Frontend:</Typography>
                  <Chip
                    label={stats.serverStatus.frontend ? 'Online' : 'Offline'}
                    color={stats.serverStatus.frontend ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>AI Service:</Typography>
                  <Chip
                    label={stats.serverStatus.aiService ? 'Online' : 'Offline'}
                    color={stats.serverStatus.aiService ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>Room Server:</Typography>
                  <Chip
                    label={stats.serverStatus.roomServer ? 'Online' : 'Offline'}
                    color={stats.serverStatus.roomServer ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>System Uptime:</strong> {new Date(stats.systemUptime).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Revenue:</strong> ${stats.totalRevenue}
                </Typography>
                <Typography variant="body2">
                  <strong>Owner ID:</strong> {owner.id}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)}>
        <DialogTitle>Ban User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ban Reason"
            fullWidth
            variant="outlined"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBanDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => selectedUser && handleBanUser(selectedUser.id, banReason)}
            color="error"
            variant="contained"
          >
            Ban User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerDashboard;
