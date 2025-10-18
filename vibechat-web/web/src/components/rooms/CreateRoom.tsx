import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Room as RoomIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  EmojiObjects as BotIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRoomStore } from '../../store/roomStore';
import { CreateRoomRequest } from '../../types';

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createRoom, isLoading } = useRoomStore();

  const [formData, setFormData] = useState<CreateRoomRequest>({
    name: '',
    description: '',
    maxMembers: 50,
    allowBots: true,
    linkExpirationDays: 30,
    permanentLink: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  const handleInputChange = (field: keyof CreateRoomRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    }

    if (formData.name.length < 3) {
      newErrors.name = 'Room name must be at least 3 characters';
    }

    if (formData.name.length > 100) {
      newErrors.name = 'Room name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.maxMembers && (formData.maxMembers < 2 || formData.maxMembers > 1000)) {
      newErrors.maxMembers = 'Max members must be between 2 and 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createRoom(formData);
      if (result) {
        setCreatedRoom(result);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    navigate('/rooms');
  };

  const handleGoToRoom = () => {
    setShowPreview(false);
    if (createdRoom?.roomCode) {
      navigate(`/chat/${createdRoom.roomCode}`);
    }
  };

  const roomCategories = [
    { value: 'general', label: 'General', icon: '💬', description: 'General discussion and chat' },
    { value: 'gaming', label: 'Gaming', icon: '🎮', description: 'Gaming discussions and sessions' },
    { value: 'study', label: 'Study', icon: '📚', description: 'Study groups and educational content' },
    { value: 'work', label: 'Work', icon: '💼', description: 'Professional discussions and collaboration' },
    { value: 'social', label: 'Social', icon: '👥', description: 'Social gatherings and casual chat' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <RoomIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Room
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a custom chat room for your community, friends, or team
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Room Configuration */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RoomIcon />
                  Room Configuration
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Room Name */}
                    <TextField
                      label="Room Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      fullWidth
                      placeholder="e.g., My Awesome Chat Room"
                    />

                    {/* Room Description */}
                    <TextField
                      label="Description (Optional)"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description || 'Brief description of your room\'s purpose'}
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="e.g., A place for friends to chat and share ideas"
                    />

                    {/* Max Members */}
                    <TextField
                      label="Max Members"
                      type="number"
                      value={formData.maxMembers}
                      onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value) || 50)}
                      error={!!errors.maxMembers}
                      helperText={errors.maxMembers || 'Maximum number of people who can join (2-1000)'}
                      inputProps={{ min: 2, max: 1000 }}
                      fullWidth
                    />

                    {/* Allow Bots */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.allowBots}
                          onChange={(e) => handleInputChange('allowBots', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">Allow AI Bots</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Let users add AI bots to enhance the room experience
                          </Typography>
                        </Box>
                      }
                    />

                    {/* Link Expiration Settings */}
                    <Card sx={{ mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinkIcon />
                          Room Link Settings
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {/* Permanent Link Toggle */}
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.permanentLink}
                                onChange={(e) => {
                                  handleInputChange('permanentLink', e.target.checked);
                                  if (e.target.checked) {
                                    handleInputChange('linkExpirationDays', 0);
                                  }
                                }}
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1">Permanent Room Link</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Create a link that never expires (cannot be undone)
                                </Typography>
                              </Box>
                            }
                          />

                          {/* Link Expiration Days (only if not permanent) */}
                          {!formData.permanentLink && (
                            <TextField
                              label="Link Expiration (Days)"
                              type="number"
                              value={formData.linkExpirationDays}
                              onChange={(e) => handleInputChange('linkExpirationDays', parseInt(e.target.value) || 30)}
                              inputProps={{ min: 1, max: 365 }}
                              helperText="How many days before the room link expires (1-365 days)"
                              fullWidth
                            />
                          )}

                          {/* Link Preview */}
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Link Preview:</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {formData.permanentLink
                                ? 'https://CoreVibeChatrooms.com/ABC12345 (Permanent)'
                                : `https://CoreVibeChatrooms.com/ABC12345 (Expires in ${formData.linkExpirationDays || 30} days)`
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{ mt: 2 }}
                    >
                      {isLoading ? 'Creating Room...' : 'Create Room'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Room Features & Settings */}
          <Grid item xs={12} md={4}>
            {/* Room Categories */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RoomIcon />
                  Room Categories
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {roomCategories.map((category) => (
                    <Box
                      key={category.value}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Typography variant="h6">{category.icon}</Typography>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {category.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {category.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Room Settings Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon />
                  Room Settings
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      Real-time messaging with WebSocket
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      Message history and persistence
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      User presence indicators
                    </Typography>
                  </Box>

                  {formData.allowBots && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BotIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2">
                        AI bot integration enabled
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ color: 'info.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      Up to {formData.maxMembers} members
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon />
                  How Room Creation Works
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>1. Choose Your Settings</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure your room name, description, and access settings
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>2. AI Generates Room Code</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Our AI creates a unique 8-character room code for your room
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>3. Share Your Room</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Share the room code or URL with friends to invite them
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>4. Start Chatting</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Join the room and start real-time conversations immediately
                    </Typography>
                  </Box>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>💡 Pro Tip:</strong> Choose a descriptive name and add a clear description to help others understand your room's purpose!
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Room Creation Success Dialog */}
        <Dialog open={showPreview} onClose={handlePreviewClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ color: 'success.main' }} />
            Room Created Successfully!
          </DialogTitle>
          <DialogContent>
            {createdRoom && (
              <>
                <Typography variant="body1" gutterBottom>
                  Your room "{createdRoom.name}" has been created!
                </Typography>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Room Code:</strong>
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', mb: 1 }}>
                    {createdRoom.roomCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Room URL:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {createdRoom.roomUrl}
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Share this room code or URL with your friends so they can join your room!
                  </Typography>
                </Alert>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePreviewClose}>
              Go to My Rooms
            </Button>
            <Button onClick={handleGoToRoom} variant="contained">
              Join Room Now
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CreateRoom;
