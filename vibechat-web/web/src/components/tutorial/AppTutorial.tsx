import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  Chip,
  Avatar,
  Grid,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Lightbulb as LightbulbIcon,
  SmartToy as SmartToyIcon,
  SmartToy as BotIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Room as RoomIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  highlightElement?: string;
  action?: string;
  completed?: boolean;
}

const AppTutorial: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: '🎉 Welcome to VibeChat!',
      description: 'Your adventure in real-time communication starts here!',
      content: (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
            <ChatIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Welcome to VibeChat, {user?.username}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            I'm your friendly AI guide, and I'm here to show you everything you can do in our amazing chat platform.
            Let's explore together! 🚀
          </Typography>
          <Typography variant="body2" color="primary">
            💡 Tip: You can always restart this tutorial from Settings if you need a refresher!
          </Typography>
        </Box>
      ),
    },
    {
      id: 2,
      title: '🏠 Your Dashboard - Command Center',
      description: 'This is where your chat adventure begins!',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Your Dashboard is like your personal command center! Here's what you'll see:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    📊 Stats Overview
                  </Typography>
                  <Typography variant="body2">
                    See your total rooms, active chats, and bot count at a glance!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    🏠 My Chat Rooms
                  </Typography>
                  <Typography variant="body2">
                    All your rooms in one place - click to join the conversation!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            ✨ <strong>Pro Tip:</strong> Your dashboard updates in real-time as you create and join rooms!
          </Typography>
        </Box>
      ),
      highlightElement: '#dashboard',
    },
    {
      id: 3,
      title: '🏗️ Create Your First Room',
      description: 'Let\'s build your first chat room!',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Creating a room is super easy! Here's how:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="contained" size="small">
                <RoomIcon sx={{ mr: 1 }} />
                Create Room
              </Button>
              <Typography variant="body2">
                Click this button to start building your room!
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              💡 Your room gets a unique 8-character code like <strong>ABC12345</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🔗 Share your room URL: <strong>https://CoreVibeChatrooms.com/ABC12345</strong>
            </Typography>
          </Box>
        </Box>
      ),
      action: 'create-room',
    },
    {
      id: 4,
      title: '🤖 Meet Your AI Bots!',
      description: 'Create smart bots to help manage your rooms',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Bots are your AI assistants! Here's what they can do:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <PeopleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="subtitle2">Monitor Activity</Typography>
                <Typography variant="caption">
                  Keep an eye on what's happening in your room
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <SettingsIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
                <Typography variant="subtitle2">Create Roles</Typography>
                <Typography variant="caption">
                  Set up custom user roles and permissions
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <BotIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                <Typography variant="subtitle2">Manage Moderators</Typography>
                <Typography variant="caption">
                  Help keep your community safe and organized
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Security First:</strong> All bots follow strict rules - they can only help with room management,
              never access user data or perform harmful actions.
            </Typography>
          </Alert>
        </Box>
      ),
      action: 'bots',
    },
    {
      id: 5,
      title: '⚡ Real-Time Chat Experience',
      description: 'Experience lightning-fast messaging',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Chat in real-time with our WebSocket technology!
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label="Instant Delivery" color="success" />
              <Typography variant="body2">
                Messages appear instantly for all users
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label="User Presence" color="info" />
              <Typography variant="body2">
                See who's online and typing in real-time
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label="Cross-Platform" color="primary" />
              <Typography variant="body2">
                Works on web, desktop, and mobile devices
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            🌐 <strong>Pro Tip:</strong> All messages are encrypted and secure. Your conversations stay private!
          </Typography>
        </Box>
      ),
    },
    {
      id: 6,
      title: '📱 Mobile & Desktop Apps',
      description: 'Take your chat everywhere you go!',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            VibeChat works perfectly on all your devices!
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <ChatIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">Web Browser</Typography>
                <Typography variant="body2" color="text.secondary">
                  Access from any modern browser - no downloads needed!
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <DownloadIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6">Desktop App</Typography>
                <Typography variant="body2" color="text.secondary">
                  Native app with notifications and system integration
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <SmartToyIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6">Mobile Responsive</Typography>
                <Typography variant="body2" color="text.secondary">
                  Optimized for phones and tablets with touch controls
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 7,
      title: '🔗 Sharing & Inviting Friends',
      description: 'Bring your friends into the conversation!',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Sharing your rooms is super easy! Here's how:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShareIcon color="primary" />
              <Typography variant="body1">
                <strong>Copy Room Code:</strong> Get your 8-character code
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShareIcon color="secondary" />
              <Typography variant="body1">
                <strong>Share Room Link:</strong> Send the full URL to friends
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon color="success" />
              <Typography variant="body1">
                <strong>Invite Users:</strong> Use the built-in invite system
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            📧 <strong>Example:</strong> "Hey! Join my gaming room: https://CoreVibeChatrooms.com/ABC12345"
          </Typography>
        </Box>
      ),
    },
    {
      id: 8,
      title: '🎮 Room Categories & Features',
      description: 'Discover all the amazing room types available!',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Choose the perfect room type for your needs:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h6">💬 General</Typography>
                <Typography variant="caption">Everyday conversations</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <Typography variant="h6">🎮 Gaming</Typography>
                <Typography variant="caption">Gaming communities</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                <Typography variant="h6">📚 Study</Typography>
                <Typography variant="caption">Learning groups</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <Typography variant="h6">💼 Work</Typography>
                <Typography variant="caption">Professional teams</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 9,
      title: '🚀 You\'re All Set!',
      description: 'Ready to start your VibeChat adventure!',
      content: (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            🎉 Tutorial Complete!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You're now ready to explore all the amazing features of VibeChat!
            Remember, you can always come back to this tutorial if you need help.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Quick Reminder:</strong> To add features to your bots, just ask Cursor:
            "What features would you like to add to your bot?"
          </Typography>
        </Box>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Mark tutorial as completed
    localStorage.setItem('vibechat_tutorial_completed', 'true');
    onComplete();
  };

  const handleStepAction = (action: string) => {
    switch (action) {
      case 'create-room':
        navigate('/rooms/create');
        break;
      case 'bots':
        navigate('/bots');
        break;
      default:
        break;
    }
    // Don't complete tutorial, let them explore
  };

  const currentTutorialStep = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <Dialog
      open={true}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }
      }}
    >
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            pb: 2,
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightbulbIcon />
              VibeChat Tutorial
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Step {currentStep + 1} of {tutorialSteps.length}
            </Typography>
          </Box>
          <IconButton onClick={onComplete} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ px: 3, py: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, pb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {currentTutorialStep.title}
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.9)" sx={{ mb: 3 }}>
            {currentTutorialStep.description}
          </Typography>

          {currentTutorialStep.content}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'white', borderColor: 'white' }}
              variant="outlined"
            >
              Previous
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {currentTutorialStep.action && (
                <Button
                  variant="contained"
                  onClick={() => handleStepAction(currentTutorialStep.action!)}
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                >
                  Try It Now!
                </Button>
              )}

              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete Tutorial' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AppTutorial;


