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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  SmartToy as BotIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Room as RoomIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBotStore } from '../../store/botStore';
import { Bot } from '../../types';

const BotList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bots, fetchUserBots, deleteBot, isLoading } = useBotStore();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; bot: Bot | null }>({
    open: false,
    bot: null,
  });

  useEffect(() => {
    fetchUserBots();
  }, [fetchUserBots]);

  const handleDeleteBot = async (bot: Bot) => {
    try {
      await deleteBot(bot.id);
      setDeleteDialog({ open: false, bot: null });
    } catch (error) {
      console.error('Failed to delete bot:', error);
    }
  };

  const handleDownloadBot = async (botId: number) => {
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
        a.download = `vibechat_bot_${botId}.py`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download bot file');
      }
    } catch (error) {
      console.error('Failed to download bot file:', error);
    }
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
              My Bots
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your AI bots and their capabilities
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/bots/create')}
          >
            Create Bot
          </Button>
        </Box>

        {/* Instructions */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>How to use your bots:</strong>
            <br />
            1. Create a bot from the list below
            <br />
            2. Go to bot details and click "Download Bot File"
            <br />
            3. Run the downloaded Python file to start your bot
            <br />
            4. To add features, ask Cursor what you want to add to your bot
          </Typography>
        </Alert>

        {/* Bots Grid */}
        {isLoading ? (
          <Typography>Loading bots...</Typography>
        ) : bots.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BotIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bots yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first bot to get started with AI-powered chat room management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/bots/create')}
            >
              Create Your First Bot
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {bots.map((bot) => (
              <Grid item xs={12} sm={6} md={4} key={bot.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BotIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h3" noWrap>
                        {bot.name}
                      </Typography>
                    </Box>

                    {bot.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {bot.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={bot.isActive ? 'Active' : 'Inactive'}
                          color={bot.isActive ? 'success' : 'default'}
                          size="small"
                        />
                        <Chip
                          label={bot.aiModel}
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      {bot.room && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RoomIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {bot.room.name}
                          </Typography>
                        </Box>
                      )}

                      <Typography variant="caption" color="text.secondary">
                        Created {formatDate(bot.createdAt)}
                      </Typography>
                    </Box>

                    {/* Bot Capabilities Preview */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Capabilities:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {bot.canMonitorRoom && (
                          <Chip label="Monitor" size="small" color="success" variant="outlined" />
                        )}
                        {bot.canCreateRoles && (
                          <Chip label="Create Roles" size="small" color="success" variant="outlined" />
                        )}
                        {bot.canCreateModerators && (
                          <Chip label="Create Mods" size="small" color="success" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <Tooltip title="Download Bot File">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadBot(bot.id)}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/bots/${bot.id}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box>
                      <Tooltip title="Edit Bot">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/bots/${bot.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Bot">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteDialog({ open: true, bot })}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, bot: null })}>
          <DialogTitle>Delete Bot</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the bot "{deleteDialog.bot?.name}"?
              This action cannot be undone and will also delete the associated bot file.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, bot: null })}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialog.bot && handleDeleteBot(deleteDialog.bot)}
              color="error"
              variant="contained"
            >
              Delete Bot
            </Button>
          </DialogActions>
        </Dialog>

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
          onClick={() => navigate('/bots/create')}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
};

export default BotList;
