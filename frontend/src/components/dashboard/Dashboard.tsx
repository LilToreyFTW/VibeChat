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
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ContentCopy as CopyIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRoomStore } from '../../store/roomStore';
import { useTutorialStore } from '../../store/tutorialStore';
import { Room } from '../../types';
import apiService from '../../services/api';
import TutorialWelcome from '../tutorial/TutorialWelcome';
import TutorialOverlay from '../tutorial/TutorialOverlay';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { rooms, fetchMyRooms, isLoading } = useRoomStore();
  const { isCompleted: tutorialCompleted, startTutorial } = useTutorialStore();

  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    fetchMyRooms();
  }, [fetchMyRooms]);

  // Check if user should see tutorial on first login
  useEffect(() => {
    if (user && !tutorialCompleted && !showTutorial) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, tutorialCompleted, showTutorial]);

  const handleTutorialStart = () => {
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

  const handleStartTutorialFromHelp = () => {
    startTutorial();
  };

  const handleCreateRoom = () => {
    navigate('/rooms/create');
  };

  const handleJoinRoom = (roomCode: string) => {
    navigate(`/chat/${roomCode}`);
  };

  const handleCopyRoomCode = (roomCode: string) => {
    navigator.clipboard.writeText(roomCode);
    // You could add a toast notification here
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    try {
      const response = await apiService.resendVerification(user.email);
      if (response.success) {
        setEmailVerificationSent(true);
      }
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Email Verification Alert */}
        {!user?.emailVerified && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleResendVerification}
                disabled={emailVerificationSent}
              >
                {emailVerificationSent ? 'Sent!' : 'Resend'}
              </Button>
            }
          >
            Your email address is not verified. Please check your email for a verification link.
            {emailVerificationSent && ' Verification email sent!'}
          </Alert>
        )}

        {/* Header */}
        <Box className="dashboard-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to VibeChat, {user?.username}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your chat rooms and connect with others
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Get Help / Start Tutorial">
              <IconButton
                onClick={handleStartTutorialFromHelp}
                color="primary"
                sx={{ mr: 1 }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Button
              className="create-room-btn"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateRoom}
            >
              Create Room
            </Button>

            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} color="error">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

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
            <Card className="bots-section">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Bots Created
                </Typography>
                <Typography variant="h4">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  User ID
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {user?.userId}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* My Rooms Section */}
        <Box className="my-rooms-section" sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            My Chat Rooms
          </Typography>

          {isLoading ? (
            <Typography>Loading rooms...</Typography>
          ) : rooms.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ChatIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No chat rooms yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first chat room to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateRoom}
              >
                Create Your First Room
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {rooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} key={room.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" noWrap>
                          {room.name}
                        </Typography>
                        <Chip
                          label={room.isActive ? 'Active' : 'Inactive'}
                          color={room.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>

                      {room.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {room.description}
                        </Typography>
                      )}

                      <Box className="room-code-copy" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {room.roomCode}
                        </Typography>
                        <Tooltip title="Copy room code">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyRoomCode(room.roomCode)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Created {formatDate(room.createdAt)}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        className="join-chat-btn"
                        size="small"
                        onClick={() => handleJoinRoom(room.roomCode)}
                      >
                        Join Chat
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/rooms/${room.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/rooms')}
          >
            View All Rooms
          </Button>
        </Box>
      </Box>

      {/* Tutorial Components */}
      {showTutorial && (
        <TutorialWelcome
          onStart={handleTutorialStart}
          onSkip={handleTutorialSkip}
        />
      )}

      <TutorialOverlay
        onComplete={handleTutorialStart}
        onSkip={handleTutorialSkip}
      />
    </Container>
  );
};

export default Dashboard;
