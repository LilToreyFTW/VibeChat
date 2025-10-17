import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SmartToy as BotIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBotStore } from '../../store/botStore';
import { Bot } from '../../types';
import apiService from '../../services/api';

const BotDetails: React.FC = () => {
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentBot, fetchBotById, deleteBot } = useBotStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (botId) {
      fetchBotById(parseInt(botId));
      setLoading(false);
    }
  }, [botId, fetchBotById]);

  const handleDownloadBot = async () => {
    if (!botId) return;

    setDownloading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/bots/${botId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `vibechat_${currentBot?.name?.toLowerCase().replace(/[^a-z0-9]/g, '_')}_bot.py`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download bot file');
      }
    } catch (error) {
      setError('Failed to download bot file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!botId) return;

    try {
      await deleteBot(parseInt(botId));
      navigate('/bots');
    } catch (error) {
      setError('Failed to delete bot. Please try again.');
    }
    setDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCapabilityIcon = (allowed: boolean) => {
    return allowed ? (
      <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
    ) : (
      <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
    );
  };

  const getCapabilityColor = (allowed: boolean) => {
    return allowed ? 'success' : 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading bot details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!currentBot) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Bot not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BotIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1">
                {currentBot.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bot Details & Configuration
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadBot}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download Bot File'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/bots/${botId}/edit`)}
            >
              Edit Bot
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog(true)}
            >
              Delete Bot
            </Button>
          </Box>
        </Box>

        {/* Bot Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BotIcon />
                  Bot Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{currentBot.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{currentBot.description || 'No description'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">AI Model</Typography>
                    <Typography variant="body1">{currentBot.aiModel}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Created</Typography>
                    <Typography variant="body1">{formatDate(currentBot.createdAt)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={currentBot.isActive ? 'Active' : 'Inactive'}
                      color={currentBot.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Ownership
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Owner</Typography>
                    <Typography variant="body1">{currentBot.owner.username}</Typography>
                  </Box>
                  {currentBot.room && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">Assigned Room</Typography>
                      <Typography variant="body1">{currentBot.room.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Code: {currentBot.room.roomCode}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" color="text.secondary">Bot Token</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                      {currentBot.botToken.substring(0, 16)}...
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bot Capabilities */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon />
              Bot Capabilities & Restrictions
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Security Notice:</strong> This bot follows hardcoded security restrictions.
                Prohibited capabilities are permanently disabled and cannot be modified.
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              {/* Allowed Capabilities */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom color="success.main">
                  ✅ Allowed Capabilities
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canMonitorRoom)}
                    <Typography variant="body2">
                      Monitor chatroom activity
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canCreateRoles)}
                    <Typography variant="body2">
                      Create custom roles in chatroom
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canCreateModerators)}
                    <Typography variant="body2">
                      Create moderators for chatroom
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Prohibited Capabilities */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom color="error.main">
                  ❌ Prohibited Capabilities
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canSearchUsers)}
                    <Typography variant="body2">
                      Search or fetch user accounts
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canFetchUserData)}
                    <Typography variant="body2">
                      Fetch user data
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canDDoS)}
                    <Typography variant="body2">
                      Perform DDoS attacks
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canReverseConnect)}
                    <Typography variant="body2">
                      Use reverse connection scripts
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCapabilityIcon(currentBot.canAccessUserSystems)}
                    <Typography variant="body2">
                      Access other users' systems
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Bot Instructions */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BotIcon />
              Bot Usage Instructions
            </Typography>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Important:</strong> When you download the bot file, it contains your personal account token.
                Never share this file with anyone else.
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              📋 How to Use Your Bot
            </Typography>

            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" gutterBottom>
                1. <strong>Download the Bot File:</strong> Click "Download Bot File" above to get your personalized bot code
              </Typography>

              <Typography variant="body1" gutterBottom>
                2. <strong>Install Dependencies:</strong> Run <code>pip install requests websocket-client</code>
              </Typography>

              <Typography variant="body1" gutterBottom>
                3. <strong>Run the Bot:</strong> Execute <code>python vibechat_[bot_name]_bot.py</code>
              </Typography>

              <Typography variant="body1" gutterBottom>
                4. <strong>Add Features:</strong> Ask Cursor what features you want to add to your bot
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>💡 Need Help?</strong> To add features to your bot, simply ask Cursor:
                <br />
                <em>"What features would you like to add to your bot?"</em>
                <br />
                Cursor will help you safely extend your bot's capabilities within the allowed restrictions.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Bot</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the bot "{currentBot.name}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteBot} color="error" variant="contained">
              Delete Bot
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default BotDetails;
