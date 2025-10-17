import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Hooks and Stores
import { useAuthStore } from './store/authStore';

// Create Discord-like dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5865f2', // Discord blurple
    },
    secondary: {
      main: '#57f287', // Discord green
    },
    background: {
      default: '#313338', // Discord dark background
      paper: '#2b2d31',
    },
    text: {
      primary: '#dbdee1',
      secondary: '#b5bac1',
    },
  },
  typography: {
    fontFamily: '"Whitney", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#202225 #2f3136',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#2f3136',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#202225',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#1a1b1e',
          },
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
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
        <div className="App" style={{ height: '100vh' }}>
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
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
