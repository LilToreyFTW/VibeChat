import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../../services/api';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      handleVerification(tokenParam);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleVerification = async (verificationToken: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.verifyEmail(verificationToken);

      if (response.success) {
        setSuccess('Email verified successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || 'Email verification failed');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Email verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.resendVerification(email);

      if (response.success) {
        setSuccess('Verification email sent successfully!');
      } else {
        setError(response.message || 'Failed to send verification email');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setIsLoading(false);
    }
  };

  if (token) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Email Verification
            </Typography>

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {!isLoading && !success && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  If verification failed, you can try again or request a new verification email.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Resend Verification Email
          </Typography>

          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address to receive a new verification email.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: 48 }}
            onClick={handleResendVerification}
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Verification Email'
            )}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Remember your verification link?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ p: 0, minWidth: 'auto' }}
              >
                Back to Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerificationPage;
