import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Detect if running in Electron
const isElectron = typeof window !== 'undefined' && window.electron;
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery } from '@mui/material';

// Discord-like Layout Components
import LeftSidebar from './components/discord/LeftSidebar';
import CentralPane from './components/discord/CentralPane';
import RightSidebar from './components/discord/RightSidebar';
import TopBar from './components/discord/TopBar';
import BottomBar from './components/discord/BottomBar';
import UserSettingsModal from './components/discord/UserSettingsModal';

// Auth Components (keeping existing)
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import EmailVerificationPage from './components/auth/EmailVerificationPage';

// Owner Control Components
import OwnerControl from './pages/OwnerControl';

// Billing Components
import SubscriptionManager from './components/billing/SubscriptionManager';

// Hooks and Stores
import { useAuthStore } from './store/authStore';

// Create VibeChat modern theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6', // VibeChat purple
    },
    secondary: {
      main: '#EC4899', // VibeChat pink
    },
    background: {
      default: '#0F172A', // VibeChat dark
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: 'rgba(248, 250, 252, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 700,
      background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #06B6D4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(15, 23, 42, 0.5)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(135deg, #EC4899 0%, #06B6D4 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to main app if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main Discord Layout Component
const DiscordLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [selectedServer, setSelectedServer] = useState<string>('home');
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'background.default',
      overflow: 'hidden'
    }}>
      {/* Top Bar */}
      <TopBar onSettingsClick={() => setSettingsOpen(true)} />

      {/* Main Content Area */}
      <Box sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Left Sidebar - Server/Guild Hub */}
        <LeftSidebar
          selectedServer={selectedServer}
          onServerSelect={setSelectedServer}
        />

        {/* Central Pane - Content Area */}
        <CentralPane
          selectedServer={selectedServer}
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        />

        {/* Right Sidebar - Members & Activity */}
        {!isMobile && rightSidebarOpen && (
          <RightSidebar
            selectedServer={selectedServer}
            selectedChannel={selectedChannel}
          />
        )}
      </Box>

      {/* Bottom Bar - Input & Controls */}
      <BottomBar selectedChannel={selectedChannel} />

      {/* User Settings Modal */}
      <UserSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Mobile Navigation Overlay would go here */}
      {children}
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App" style={{ height: '100vh', position: 'relative' }}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-email"
              element={<EmailVerificationPage />}
            />
            <Route
              path="/auth/verify-success"
              element={
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>Email Verification</h2>
                  <p>Redirecting to verification page...</p>
                </div>
              }
            />

            <Route
              path="/boost"
              element={
                <ProtectedRoute>
                  <SubscriptionManager />
                </ProtectedRoute>
              }
            />

            {/* Owner Control Route */}
            <Route
              path="/owner"
              element={<OwnerControl />}
            />

            {/* Main Discord Interface */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DiscordLayout />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* VibeChat Watermark */}
          <div className="watermark">
            VibeChat
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
