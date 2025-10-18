import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fab,
  Badge,
} from '@mui/material';
import {
  People as PeopleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  isActive: boolean;
  isSuperuser: boolean;
  developerMode: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | 'promote' | 'demote' | 'delete' | null;
  }>({ open: false, type: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API call
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          fullName: 'John Doe',
          isActive: true,
          isSuperuser: false,
          developerMode: false,
          emailVerified: true,
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-01-20T14:22:00Z',
        },
        {
          id: 2,
          username: 'jane_admin',
          email: 'jane@admin.com',
          fullName: 'Jane Administrator',
          isActive: true,
          isSuperuser: true,
          developerMode: true,
          emailVerified: true,
          createdAt: '2024-01-01T09:00:00Z',
          lastLogin: '2024-01-20T16:45:00Z',
        },
        {
          id: 3,
          username: 'inactive_user',
          email: 'inactive@example.com',
          fullName: 'Inactive User',
          isActive: false,
          isSuperuser: false,
          developerMode: false,
          emailVerified: false,
          createdAt: '2024-01-10T11:15:00Z',
          lastLogin: '2024-01-15T13:30:00Z',
        },
        {
          id: 4,
          username: 'new_user',
          email: 'newuser@example.com',
          fullName: 'New User',
          isActive: true,
          isSuperuser: false,
          developerMode: false,
          emailVerified: false,
          createdAt: '2024-01-19T15:20:00Z',
        },
        {
          id: 5,
          username: 'dev_user',
          email: 'dev@example.com',
          fullName: 'Developer User',
          isActive: true,
          isSuperuser: false,
          developerMode: true,
          emailVerified: true,
          createdAt: '2024-01-05T12:00:00Z',
          lastLogin: '2024-01-20T17:10:00Z',
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        switch (statusFilter) {
          case 'active':
            return user.isActive;
          case 'inactive':
            return !user.isActive;
          case 'verified':
            return user.emailVerified;
          case 'unverified':
            return !user.emailVerified;
          default:
            return true;
        }
      });
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => {
        switch (roleFilter) {
          case 'admin':
            return user.isSuperuser;
          case 'developer':
            return user.developerMode;
          case 'regular':
            return !user.isSuperuser && !user.developerMode;
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
  };

  const handleAction = (user: User, action: 'activate' | 'deactivate' | 'promote' | 'demote' | 'delete') => {
    setSelectedUser(user);
    setActionDialog({ open: true, type: action });
  };

  const executeAction = async () => {
    if (!selectedUser || !actionDialog.type) return;

    try {
      // Simulate API call - replace with actual API call
      const updatedUsers = users.map(u => {
        if (u.id === selectedUser.id) {
          switch (actionDialog.type) {
            case 'activate':
              return { ...u, isActive: true };
            case 'deactivate':
              return { ...u, isActive: false };
            case 'promote':
              return { ...u, isSuperuser: true, developerMode: true };
            case 'demote':
              return { ...u, isSuperuser: false, developerMode: false };
            case 'delete':
              return null;
            default:
              return u;
          }
        }
        return u;
      }).filter(Boolean) as User[];

      setUsers(updatedUsers);
      setActionDialog({ open: false, type: null });
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadge = (user: User) => {
    if (user.isSuperuser) {
      return <Chip label="Admin" color="error" size="small" />;
    }
    if (user.developerMode) {
      return <Chip label="Developer" color="warning" size="small" />;
    }
    return <Chip label="User" color="primary" size="small" />;
  };

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return <Chip label="Inactive" color="default" size="small" />;
    }
    if (!user.emailVerified) {
      return <Chip label="Unverified" color="warning" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage user accounts, roles, and permissions
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
            >
              Add User
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {users.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4">
                  {users.filter(u => u.isActive).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Verified Users
                </Typography>
                <Typography variant="h4">
                  {users.filter(u => u.emailVerified).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Administrators
                </Typography>
                <Typography variant="h4">
                  {users.filter(u => u.isSuperuser).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search by username, email, or name..."
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filter by Status"
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="active">Active Only</MenuItem>
                    <MenuItem value="inactive">Inactive Only</MenuItem>
                    <MenuItem value="verified">Verified Only</MenuItem>
                    <MenuItem value="unverified">Unverified Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Role</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Filter by Role"
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="admin">Administrators</MenuItem>
                    <MenuItem value="developer">Developers</MenuItem>
                    <MenuItem value="regular">Regular Users</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                      ? 'No users match your filters'
                      : 'No users found'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.fullName || user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>{getRoleBadge(user)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit User">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {user.isActive ? (
                          <Tooltip title="Deactivate User">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleAction(user, 'deactivate')}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Activate User">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleAction(user, 'activate')}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {!user.isSuperuser ? (
                          <Tooltip title="Promote to Admin">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleAction(user, 'promote')}
                            >
                              <PersonAddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Demote from Admin">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleAction(user, 'demote')}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleAction(user, 'delete')}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Confirmation Dialog */}
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })}>
          <DialogTitle>
            Confirm {actionDialog.type ? actionDialog.type.charAt(0).toUpperCase() + actionDialog.type.slice(1) : ''} Action
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionDialog.type} user "{selectedUser?.username}"?
              {actionDialog.type === 'delete' && ' This action cannot be undone.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              variant="contained"
              color={actionDialog.type === 'delete' ? 'error' : 'primary'}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserManagement;
