import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Fade,
  Avatar,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  EmojiObjects as BotIcon,
  Group as GroupIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTutorialStore } from '../../store/tutorialStore';
import { useAuthStore } from '../../store/authStore';

interface TutorialWelcomeProps {
  onStart?: () => void;
  onSkip?: () => void;
}

const TutorialWelcome: React.FC<TutorialWelcomeProps> = ({ onStart, onSkip }) => {
  const { user } = useAuthStore();
  const { isCompleted, startTutorial, skipTutorial } = useTutorialStore();

  useEffect(() => {
    // Check if tutorial is already completed
    if (isCompleted) {
      if (onSkip) {
        onSkip();
      }
      return;
    }
  }, [isCompleted, onSkip]);

  const handleStartTutorial = () => {
    startTutorial();
    if (onStart) {
      onStart();
    }
  };

  const handleSkipTutorial = () => {
    skipTutorial();
    if (onSkip) {
      onSkip();
    }
  };

  if (isCompleted) {
    return null;
  }

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={24}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <HelpIcon sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Welcome to VibeChat! 🎉
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Hi {user?.username}!
              </Typography>

              <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                We're excited to have you join our community! Let us show you around and help you get started with all the amazing features VibeChat has to offer.
              </Typography>
            </Box>

            {/* Features Preview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', border: '2px solid', borderColor: 'primary.light' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                      <ChatIcon />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      Create Rooms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Set up chat rooms and invite friends to join your conversations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', border: '2px solid', borderColor: 'secondary.light' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                      <BotIcon />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      AI Bots
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create intelligent bots that can moderate, entertain, and assist in your rooms
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', border: '2px solid', borderColor: 'success.light' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                      <GroupIcon />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      Share & Connect
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Share room codes with friends to grow your community and stay connected
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', border: '2px solid', borderColor: 'warning.light' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                      <SettingsIcon />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      Customize
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Personalize your experience with custom bots, settings, and preferences
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Tutorial Info */}
            <Box sx={{ mb: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.contrastText' }}>
                🚀 Quick Start Tutorial
              </Typography>
              <Typography variant="body2" sx={{ color: 'primary.contrastText', mb: 2 }}>
                Our interactive tutorial will guide you through:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {[
                  'Creating your first room',
                  'Understanding room codes',
                  'Creating AI bots',
                  'Managing your dashboard',
                  'Navigation basics',
                  'Profile & settings'
                ].map((item, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      color: 'primary.contrastText'
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<StartIcon />}
                onClick={handleStartTutorial}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Start Tutorial
              </Button>

              <Button
                variant="outlined"
                size="large"
                endIcon={<CloseIcon />}
                onClick={handleSkipTutorial}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Skip for Now
              </Button>
            </Box>

            {/* Footer note */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
              Don't worry, you can always start the tutorial later by clicking the help icon in the navigation!
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default TutorialWelcome;
