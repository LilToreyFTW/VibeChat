import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Videocam as StreamIcon,
  Computer as ComputerIcon,
  Monitor as MonitorIcon,
  Speed as SpeedIcon,
  Hd as HdIcon,
  FourK as FourKIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';

interface StreamingCapabilities {
  maxResolution: string;
  maxFPS: number;
  canStream4K: boolean;
  canStreamUltrawide: boolean;
  nvidiaGPU: boolean;
}

const StreamingManager: React.FC = () => {
  const { user } = useAuthStore();
  const { subscriptions } = useSubscriptionStore();

  const [capabilities, setCapabilities] = useState<StreamingCapabilities>({
    maxResolution: '1920x1080',
    maxFPS: 30,
    canStream4K: false,
    canStreamUltrawide: false,
    nvidiaGPU: false,
  });

  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamDialogOpen, setStreamDialogOpen] = useState(false);
  const [availableSources, setAvailableSources] = useState<any[]>([]);

  useEffect(() => {
    // Check streaming capabilities based on subscription
    checkStreamingCapabilities();
    getScreenSources();
  }, [subscriptions]);

  const checkStreamingCapabilities = async () => {
    try {
      if (window.electronAPI && window.electronAPI.getStreamingCapabilities) {
        const caps = await window.electronAPI.getStreamingCapabilities();
        setCapabilities(caps);
      } else {
        // Fallback for web version
        setCapabilities({
          maxResolution: '1920x1080',
          maxFPS: 30,
          canStream4K: false,
          canStreamUltrawide: false,
          nvidiaGPU: false,
        });
      }
    } catch (error) {
      console.error('Failed to get streaming capabilities:', error);
      // Fallback values
      setCapabilities({
        maxResolution: '1920x1080',
        maxFPS: 30,
        canStream4K: false,
        canStreamUltrawide: false,
        nvidiaGPU: false,
      });
    }
  };

  const getScreenSources = async () => {
    try {
      if (window.electronAPI && window.electronAPI.requestScreenShare) {
        const result = await window.electronAPI.requestScreenShare();
        if (result.success) {
          setAvailableSources(result.sources);
        }
      } else {
        // Fallback for web version
        setAvailableSources([]);
      }
    } catch (error) {
      console.error('Failed to get screen sources:', error);
      setAvailableSources([]);
    }
  };

  const getCurrentTier = () => {
    const tier5Sub = subscriptions.find(sub => sub.tier === 'BOOST_PLUS_TIER_5' && sub.status === 'ACTIVE');
    const tier4Sub = subscriptions.find(sub => sub.tier === 'BOOST_PLUS_TIER_4' && sub.status === 'ACTIVE');
    const tier3Sub = subscriptions.find(sub => sub.tier === 'BOOST_PLUS_TIER_3' && sub.status === 'ACTIVE');
    const tier2Sub = subscriptions.find(sub => sub.tier === 'BOOST_PLUS_TIER_2' && sub.status === 'ACTIVE');

    if (tier5Sub) return { tier: 5, name: 'RTX Tier', icon: <StarIcon />, color: 'error' };
    if (tier4Sub) return { tier: 4, name: '4K Tier', icon: <FourKIcon />, color: 'warning' };
    if (tier3Sub) return { tier: 3, name: 'HD+ Tier', icon: <HdIcon />, color: 'secondary' };
    if (tier2Sub) return { tier: 2, name: 'HD Tier', icon: <SpeedIcon />, color: 'primary' };
    return { tier: 1, name: 'Free', icon: <ComputerIcon />, color: 'default' };
  };

  const currentTier = getCurrentTier();

  const handleStartStream = async () => {
    if (!selectedSource) {
      return;
    }

    setIsStreaming(true);

    try {
      // Here you would implement the actual streaming logic using Electron APIs
      // For now, we'll just simulate streaming
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsStreaming(false);
      setStreamDialogOpen(false);
    } catch (error) {
      console.error('Streaming failed:', error);
      setIsStreaming(false);
    }
  };

  const getTierFeatures = () => {
    const features = [];

    if (currentTier.tier >= 2) {
      features.push('HD Streaming');
    }
    if (currentTier.tier >= 3) {
      features.push('Higher Frame Rates');
    }
    if (currentTier.tier >= 4) {
      features.push('4K Support');
    }
    if (currentTier.tier >= 5) {
      features.push('Ultrawide Support');
      features.push('RTX GPU Optimization');
    }

    return features;
  };

  const tierFeatures = getTierFeatures();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <StreamIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom className="gradient-text">
              Screen Streaming
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Share your screen with enhanced quality based on your BOOST+ tier
            </Typography>
          </Box>
        </Box>

        {/* Current Tier Display */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {currentTier.icon}
                <Typography variant="h6">
                  Current Tier: {currentTier.name}
                </Typography>
                <Chip
                  label={`Tier ${currentTier.tier}`}
                  color={currentTier.color as any}
                  size="small"
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => window.open('/boost', '_blank')}
              >
                Upgrade Tier
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Streaming Capabilities:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                icon={<MonitorIcon />}
                label={`Max Resolution: ${capabilities.maxResolution}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<SpeedIcon />}
                label={`Max FPS: ${capabilities.maxFPS}`}
                color="secondary"
                variant="outlined"
              />
              {capabilities.canStream4K && (
                <Chip
                  icon={<FourKIcon />}
                  label="4K Streaming"
                  color="warning"
                  variant="outlined"
                />
              )}
              {capabilities.canStreamUltrawide && (
                <Chip
                  icon={<MonitorIcon />}
                  label="Ultrawide Support"
                  color="error"
                  variant="outlined"
                />
              )}
              {capabilities.nvidiaGPU && (
                <Chip
                  icon={<StarIcon />}
                  label="RTX GPU Detected"
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>

            {tierFeatures.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Active Features:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tierFeatures.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      color="success"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Streaming Controls */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Start Screen Stream
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Screen Source</InputLabel>
                  <Select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    label="Select Screen Source"
                  >
                    {availableSources.map((source, index) => (
                      <MenuItem key={index} value={source.id}>
                        {source.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => setStreamDialogOpen(true)}
                  disabled={!selectedSource || isStreaming}
                  startIcon={isStreaming ? <div className="spinner" style={{ width: 20, height: 20 }} /> : <StreamIcon />}
                >
                  {isStreaming ? 'Starting Stream...' : 'Start Streaming'}
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Streaming Quality:</strong><br />
                    • Resolution: {capabilities.maxResolution}<br />
                    • Frame Rate: {capabilities.maxFPS} FPS<br />
                    {capabilities.nvidiaGPU && '• RTX GPU Optimization: Enabled'}
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stream Dialog */}
        <Dialog open={streamDialogOpen} onClose={() => !isStreaming && setStreamDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StreamIcon />
              Confirm Stream Settings
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Stream Configuration:
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">• Resolution: {capabilities.maxResolution}</Typography>
                <Typography variant="body2">• Frame Rate: {capabilities.maxFPS} FPS</Typography>
                <Typography variant="body2">• Source: {availableSources.find(s => s.id === selectedSource)?.name}</Typography>
                {capabilities.nvidiaGPU && (
                  <Typography variant="body2" color="success.main">• RTX GPU Acceleration: Active</Typography>
                )}
              </Box>
            </Box>

            {isStreaming && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="primary" gutterBottom>
                  Streaming in progress...
                </Typography>
                <LinearProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStreamDialogOpen(false)} disabled={isStreaming}>
              Cancel
            </Button>
            <Button
              onClick={handleStartStream}
              variant="contained"
              disabled={isStreaming}
            >
              {isStreaming ? 'Streaming...' : 'Start Stream'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StreamingManager;
