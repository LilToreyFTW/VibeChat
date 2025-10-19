import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import OwnerLogin from '../components/owner/OwnerLogin';
import OwnerDashboard from '../components/owner/OwnerDashboard';

const OwnerControl: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentOwner, setCurrentOwner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkOwnerAuthentication();
  }, []);

  const checkOwnerAuthentication = async () => {
    try {
      setIsLoading(true);
      
      // Check if owner is already authenticated
      const isAuth = await (window as any).electronAPI.ownerIsAuthenticated();
      if (isAuth) {
        const owner = await (window as any).electronAPI.ownerGetCurrent();
        setCurrentOwner(owner);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setError('Failed to check owner authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (owner: any) => {
    setCurrentOwner(owner);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await (window as any).electronAPI.ownerLogout();
      setCurrentOwner(null);
      setIsAuthenticated(false);
    } catch (error) {
      setError('Failed to logout');
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Box>Loading Owner Control System...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        p={3}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <OwnerLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <OwnerDashboard
      owner={currentOwner}
      onLogout={handleLogout}
    />
  );
};

export default OwnerControl;
