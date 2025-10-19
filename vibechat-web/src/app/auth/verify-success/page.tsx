'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { CheckCircle as SuccessIcon } from '@mui/icons-material';

export default function VerifySuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        setMessage('Verification token is missing');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setVerificationStatus('success');
          setMessage(data.message || 'Email verified successfully!');

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        } else {
          setVerificationStatus('error');
          setMessage(data.message || 'Email verification failed');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            {verificationStatus === 'loading' && (
              <>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h5" gutterBottom>
                  Verifying Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we verify your email address...
                </Typography>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <SuccessIcon sx={{ fontSize: 60, color: 'success.main', mb: 3 }} />
                <Typography variant="h5" gutterBottom color="success.main">
                  Email Verified!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {message}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redirecting to login page...
                </Typography>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                  {message}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => router.push('/login')}
                  fullWidth
                >
                  Back to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
