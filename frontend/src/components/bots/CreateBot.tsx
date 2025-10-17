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
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBotStore } from '../../store/botStore';
import { useRoomStore } from '../../store/roomStore';
import { CreateBotRequest } from '../../types';

const CreateBot: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createBot, isLoading } = useBotStore();
  const { rooms } = useRoomStore();

  const [formData, setFormData] = useState<CreateBotRequest>({
    name: '',
    description: '',
    aiModel: 'gpt-3.5-turbo',
    personality: '',
    roomId: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof CreateBotRequest, value: any) => {
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
      newErrors.name = 'Bot name is required';
    }

    if (formData.name.length < 3) {
      newErrors.name = 'Bot name must be at least 3 characters';
    }

    if (formData.name.length > 100) {
      newErrors.name = 'Bot name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.personality && formData.personality.length > 1000) {
      newErrors.personality = 'Personality must be less than 1000 characters';
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
      const result = await createBot(formData);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to create bot:', error);
    }
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    navigate('/bots');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <BotIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Bot
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create an AI-powered bot for your chat rooms with secure, restricted capabilities
            </Typography>
          </Box>
        </Box>

        {/* Security Notice */}
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>⚠️ Security Notice:</strong> All bots follow hardcoded security restrictions.
            Prohibited capabilities (user searches, DDoS, reverse connections, system access)
            are permanently disabled and cannot be modified.
          </Typography>
        </Alert>

        <Grid container spacing={4}>
          {/* Bot Configuration */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BotIcon />
                  Bot Configuration
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Bot Name */}
                    <TextField
                      label="Bot Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      fullWidth
                      placeholder="e.g., Room Moderator, Chat Helper"
                    />

                    {/* Bot Description */}
                    <TextField
                      label="Description (Optional)"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description || 'Brief description of what your bot will do'}
                      multiline
                      rows={2}
                      fullWidth
                      placeholder="e.g., A helpful bot that monitors chat and creates roles"
                    />

                    {/* AI Model */}
                    <FormControl fullWidth>
                      <InputLabel>AI Model</InputLabel>
                      <Select
                        value={formData.aiModel}
                        onChange={(e) => handleInputChange('aiModel', e.target.value)}
                        label="AI Model"
                      >
                        <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Recommended)</MenuItem>
                        <MenuItem value="gpt-4">GPT-4 (Advanced)</MenuItem>
                        <MenuItem value="claude-3-sonnet">Claude 3 Sonnet</MenuItem>
                        <MenuItem value="claude-3-haiku">Claude 3 Haiku (Fast)</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Personality */}
                    <TextField
                      label="Personality (Optional)"
                      value={formData.personality}
                      onChange={(e) => handleInputChange('personality', e.target.value)}
                      error={!!errors.personality}
                      helperText={errors.personality || 'How should your bot behave? (e.g., friendly, professional, fun)'}
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="e.g., A friendly and helpful assistant that loves to help users"
                    />

                    {/* Room Assignment */}
                    <FormControl fullWidth>
                      <InputLabel>Assign to Room (Optional)</InputLabel>
                      <Select
                        value={formData.roomId || ''}
                        onChange={(e) => handleInputChange('roomId', e.target.value ? Number(e.target.value) : undefined)}
                        label="Assign to Room (Optional)"
                      >
                        <MenuItem value="">
                          <em>No room assignment (standalone bot)</em>
                        </MenuItem>
                        {rooms.map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            {room.name} ({room.roomCode})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{ mt: 2 }}
                    >
                      {isLoading ? 'Creating Bot...' : 'Create Bot'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Bot Capabilities & Instructions */}
          <Grid item xs={12} md={4}>
            {/* Capabilities Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon />
                  Bot Capabilities
                </Typography>

                <Typography variant="subtitle1" gutterBottom color="success.main">
                  ✅ Allowed Capabilities
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">Monitor chatroom activity</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">Create custom roles in your chatroom</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">Create moderators for your chatroom</Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle1" gutterBottom color="error.main">
                  ❌ Prohibited Capabilities
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
                    <Typography variant="body2">Search or fetch user accounts</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
                    <Typography variant="body2">Perform DDoS attacks</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
                    <Typography variant="body2">Use reverse connection scripts</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
                    <Typography variant="body2">Access other users' systems</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon />
                  How to Use Your Bot
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>1. Create Your Bot</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fill out the form and click "Create Bot" to generate your personalized bot.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>2. Download Bot File</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Go to your bot details and click "Download Bot File" to get your Python code.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>3. Run Your Bot</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Install dependencies and run the downloaded Python file.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>4. Add Features</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ask Cursor:</strong> "What features would you like to add to your bot?"
                    </Typography>
                  </Box>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>💡 Pro Tip:</strong> Your bot file contains your personal account token.
                    Never share this file with anyone else for security reasons.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bot Creation Success Dialog */}
        <Dialog open={showPreview} onClose={handlePreviewClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon />
            Bot Created Successfully!
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Your bot "{formData.name}" has been created with the following capabilities:
            </Typography>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                ✅ Allowed Capabilities:
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">• Monitor chatroom activity</Typography>
                <Typography variant="body2">• Create custom roles in your chatroom</Typography>
                <Typography variant="body2">• Create moderators for your chatroom</Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mt: 3 }}>
              <strong>Next Steps:</strong>
            </Typography>
            <Box sx={{ pl: 2, mt: 1 }}>
              <Typography variant="body2">1. Go to your bot details page</Typography>
              <Typography variant="body2">2. Click "Download Bot File" to get your personalized Python code</Typography>
              <Typography variant="body2">3. Run the downloaded file to start your bot</Typography>
              <Typography variant="body2">4. To add features, ask Cursor what you want to add</Typography>
            </Box>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Security Reminder:</strong> Your bot follows hardcoded restrictions.
                The prohibited capabilities (user searches, DDoS, reverse connections, system access)
                are permanently disabled and cannot be modified.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePreviewClose} variant="contained">
              Go to Bot Details
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CreateBot;
