import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { LoginRequest } from '../../types';
import {
  Star as StarIcon,
  Speed as SpeedIcon,
  Hd as HdIcon,
  FourK as FourKIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, error, clearError, isLoading } = useAuthStore();
  const { fetchAvailableTiers, availableTiers } = useSubscriptionStore();

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showBoostTiers, setShowBoostTiers] = useState(false);

  useEffect(() => {
    fetchAvailableTiers();
  }, [fetchAvailableTiers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear general error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // Check if email is verified
      if (user?.emailVerified) {
        navigate('/dashboard');
      } else {
        navigate('/verify-email');
      }
    } catch (error) {
      // Error is handled by the store
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'BOOST_PLUS_TIER_2':
        return <SpeedIcon />;
      case 'BOOST_PLUS_TIER_3':
        return <HdIcon />;
      case 'BOOST_PLUS_TIER_4':
        return <FourKIcon />;
      case 'BOOST_PLUS_TIER_5':
        return <StarIcon />;
      default:
        return <CheckIcon />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BOOST_PLUS_TIER_2':
        return 'primary';
      case 'BOOST_PLUS_TIER_3':
        return 'secondary';
      case 'BOOST_PLUS_TIER_4':
        return 'warning';
      case 'BOOST_PLUS_TIER_5':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography component="h1" variant="h3" gutterBottom className="gradient-text">
            Welcome to VibeChat
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Connect, Chat, and Stream with Premium Features
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Login Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, height: 'fit-content' }}>
              <Typography component="h2" variant="h5" align="center" gutterBottom>
                Sign In
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  disabled={isLoading}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, height: 48 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Boost Tiers Display */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4 }}>
              <Typography component="h2" variant="h5" align="center" gutterBottom>
                BOOST+ Premium Tiers
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Unlock advanced streaming capabilities and premium features
              </Typography>

              <Grid container spacing={2}>
                {Object.entries(availableTiers)
                  .filter(([tier]) => tier !== 'FREE')
                  .map(([tier, tierInfo]) => (
                    <Grid item xs={12} key={tier}>
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${
                            tier === 'BOOST_PLUS_TIER_2' ? '#8B5CF6' :
                            tier === 'BOOST_PLUS_TIER_3' ? '#EC4899' :
                            tier === 'BOOST_PLUS_TIER_4' ? '#F59E0B' : '#EF4444'
                          } 0%, rgba(15, 23, 42, 0.9) 100%)`,
                          color: 'white',
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {getTierIcon(tier)}
                            <Typography variant="h6" sx={{ ml: 1 }}>
                              {tierInfo.name}
                            </Typography>
                            <Chip
                              label={`$${tierInfo.price}/month`}
                              color={getTierColor(tier)}
                              size="small"
                              sx={{ ml: 'auto' }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {tierInfo.features}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowBoostTiers(!showBoostTiers)}
                  sx={{ mb: 2 }}
                >
                  {showBoostTiers ? 'Hide' : 'View All'} Features
                </Button>
                <Typography variant="caption" display="block" color="text.secondary">
                  Sign in to access your subscription management
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginPage;
