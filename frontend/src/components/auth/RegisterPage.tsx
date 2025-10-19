import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import {
  Star as StarIcon,
  Speed as SpeedIcon,
  Hd as HdIcon,
  FourK as FourKIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuthStore();
  const { fetchAvailableTiers, availableTiers } = useSubscriptionStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
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
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      navigate('/login');
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
            Join VibeChat
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Create your account and unlock premium features
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Registration Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, height: 'fit-content' }}>
              <Typography component="h2" variant="h5" align="center" gutterBottom>
                Create Account
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={isLoading}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={isLoading}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
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
                    'Create Account'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Button
                      variant="text"
                      onClick={() => navigate('/login')}
                      sx={{ textDecoration: 'none' }}
                    >
                      Sign in
                    </Button>
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
                <Typography variant="caption" display="block" color="text.secondary">
                  Create an account to access subscription management
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RegisterPage;