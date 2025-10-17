import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

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
          <Typography component="h1" variant="h4" align="center" gutterBottom className="gradient-text">
            VibeChat Access Restricted
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Registration Disabled:</strong> New user registration is currently restricted.
              Only the system administrator can create accounts. Please contact support for access.
            </Typography>
          </Alert>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Access Information:</strong><br />
              • User registration is currently restricted<br />
              • Only the system administrator can create new accounts<br />
              • For access, please use the owner login with the provided credentials<br />
              • Contact the administrator if you need account access
            </Typography>
          </Alert>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mb: 2 }}
            >
              Go to Owner Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;