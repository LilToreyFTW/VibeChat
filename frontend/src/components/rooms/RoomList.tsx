import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Fab,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Room as RoomIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  SmartToy as BotIcon,
  Group as GroupIcon,
  Visibility as EyeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRoomStore } from '../../store/roomStore';
import { Room } from '../../types';

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { rooms, fetchMyRooms, isLoading } = useRoomStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMyRooms();
  }, [fetchMyRooms]);

  const handleRefresh = () => {
    fetchMyRooms();
  };

  const handleJoinRoom = (roomCode: string) => {
    navigate(`/chat/${roomCode}`);
  };

  const handleViewRoom = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || room.name.toLowerCase().includes(filterCategory);
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && room.isActive) ||
                         (filterStatus === 'inactive' && !room.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getRoomCategoryIcon = (roomName: string) => {
    const name = roomName.toLowerCase();
    if (name.includes('game') || name.includes('gaming')) return '🎮';
    if (name.includes('study') || name.includes('education')) return '📚';
    if (name.includes('work') || name.includes('business')) return '💼';
    if (name.includes('social') || name.includes('chat')) return '👥';
    return '💬';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              My Chat Rooms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all your created chat rooms and their settings
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh Rooms">
              <IconButton onClick={handleRefresh} disabled={isLoading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/rooms/create')}
            >
              Create New Room
            </Button>
          </Box>
        </Box>

        {/* Filters and Search */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Rooms"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search by name, description, or code..."
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Filter by Status"
                  >
                    <MenuItem value="all">All Rooms</MenuItem>
                    <MenuItem value="active">Active Only</MenuItem>
                    <MenuItem value="inactive">Inactive Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value="newest"
                    label="Sort By"
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                    <MenuItem value="activity">Most Active</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Rooms
                </Typography>
                <Typography variant="h4">
                  {rooms.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Active Rooms
                </Typography>
                <Typography variant="h4">
                  {rooms.filter(room => room.isActive).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Rooms with Bots
                </Typography>
                <Typography variant="h4">
                  {rooms.filter(room => room.allowBots).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Capacity
                </Typography>
                <Typography variant="h4">
                  {rooms.reduce((sum, room) => sum + room.maxMembers, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Rooms Grid */}
        {isLoading ? (
          <Typography>Loading rooms...</Typography>
        ) : filteredRooms.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <RoomIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm || filterStatus !== 'all' ? 'No rooms match your filters' : 'No rooms yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first chat room to get started'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/rooms/create')}
            >
              Create Your First Room
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <Typography variant="h6">
                          {getRoomCategoryIcon(room.name)}
                        </Typography>
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h3" noWrap>
                          {room.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.roomCode}
                        </Typography>
                      </Box>
                    </Box>

                    {room.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {room.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip
                        label={room.isActive ? 'Active' : 'Inactive'}
                        color={room.isActive ? 'success' : 'default'}
                        size="small"
                      />
                      {room.allowBots && (
                        <Chip
                          label="Bots Allowed"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Max {room.maxMembers} members
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Created {formatDate(room.createdAt)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <Tooltip title="Join Chat">
                        <IconButton
                          size="small"
                          onClick={() => handleJoinRoom(room.roomCode)}
                          color="primary"
                        >
                          <ChatIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewRoom(room.id)}
                        >
                          <EyeIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box>
                      <Tooltip title="Copy Room Code">
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(room.roomCode);
                          }}
                        >
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {room.roomCode}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button for Mobile */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' }
          }}
          onClick={() => navigate('/rooms/create')}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
};

export default RoomList;
