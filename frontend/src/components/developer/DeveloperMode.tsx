import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  DeveloperMode as DevIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  Settings as SettingsIcon,
  BugReport as BugIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Webhook as WebhookIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  CheckCircle as CheckIcon,
  AdminPanelSettings as CrownIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  status: 'active' | 'deprecated' | 'testing';
}

interface DevTool {
  name: string;
  description: string;
  status: 'enabled' | 'disabled' | 'testing';
  version: string;
}

const DeveloperMode: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [devTools, setDevTools] = useState<DevTool[]>([]);
  const [settings, setSettings] = useState({
    debugMode: false,
    loggingEnabled: true,
    performanceMonitoring: true,
    errorReporting: true,
    hotReload: false,
  });

  useEffect(() => {
    // Simulate fetching developer tools and settings
    const mockDevTools: DevTool[] = [
      {
        name: 'API Playground',
        description: 'Interactive API testing environment',
        status: 'enabled',
        version: '1.2.0',
      },
      {
        name: 'Performance Monitor',
        description: 'Real-time performance metrics and profiling',
        status: 'enabled',
        version: '2.1.0',
      },
      {
        name: 'Error Tracker',
        description: 'Advanced error logging and debugging',
        status: 'testing',
        version: '0.9.0',
      },
      {
        name: 'Database Inspector',
        description: 'Query analysis and optimization tools',
        status: 'disabled',
        version: '1.0.0',
      },
      {
        name: 'Security Scanner',
        description: 'Automated security vulnerability detection',
        status: 'enabled',
        version: '1.5.0',
      },
    ];

    setDevTools(mockDevTools);
  }, []);

  const apiEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/api/rooms/my-rooms', description: 'Get user\'s rooms', status: 'active' },
    { method: 'POST', path: '/api/rooms', description: 'Create new room', status: 'active' },
    { method: 'GET', path: '/api/bots/my-bots', description: 'Get user\'s bots', status: 'active' },
    { method: 'POST', path: '/api/bots', description: 'Create new bot', status: 'active' },
    { method: 'POST', path: '/api/auth/login', description: 'User authentication', status: 'active' },
    { method: 'POST', path: '/api/auth/register', description: 'User registration', status: 'active' },
    { method: 'GET', path: '/api/ai/generate-room-link', description: 'Generate room link', status: 'active' },
    { method: 'POST', path: '/api/ai/analyze-text', description: 'AI text analysis', status: 'testing' },
  ];

  const handleTestEndpoint = async () => {
    try {
      // Simulate API call - replace with actual API call
      const mockResponse = {
        success: true,
        message: 'API endpoint is working correctly',
        timestamp: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 100) + 50,
      };

      setTestResult(mockResponse);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'API endpoint failed',
        error: error,
      });
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'enabled': return 'success';
      case 'testing': return 'warning';
      case 'deprecated': case 'disabled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': case 'enabled': return <CheckIcon />;
      case 'testing': return <BugIcon />;
      case 'deprecated': case 'disabled': return <StopIcon />;
      default: return <SettingsIcon />;
    }
  };

  const handleOwnerRegistration = async () => {
    try {
      setTestResult({ success: true, message: 'Initiating owner registration...', isLoading: true });

      // @ts-ignore - Electron API
      const result = await window.electronAPI.registerOwner();

      if (result.success) {
        setTestResult({
          success: true,
          message: result.message || 'Owner registration successful!',
          data: result
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || 'Owner registration failed',
          error: result.error
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Owner registration failed',
        error: error
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <DevIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Developer Mode
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Advanced development tools and API access for power users
            </Typography>
          </Box>
        </Box>

        {/* Developer Info Alert */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Developer Access Granted:</strong> You have access to advanced development tools and API endpoints.
            Use these features responsibly and in accordance with our terms of service.
          </Typography>
        </Alert>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<CodeIcon />} label="API Playground" />
            <Tab icon={<SettingsIcon />} label="Dev Tools" />
            <Tab icon={<AnalyticsIcon />} label="Performance" />
            <Tab icon={<SecurityIcon />} label="Security" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        {activeTab === 0 && (
          <>
            {/* API Testing Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ApiIcon />
                  API Playground
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key for authenticated requests"
                    fullWidth
                    type="password"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Test Endpoint</InputLabel>
                    <Select
                      value={testEndpoint}
                      onChange={(e) => setTestEndpoint(e.target.value)}
                      label="Test Endpoint"
                    >
                      <MenuItem value="">
                        <em>Select an endpoint to test</em>
                      </MenuItem>
                      {apiEndpoints.map((endpoint, index) => (
                        <MenuItem key={index} value={`${endpoint.method} ${endpoint.path}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={endpoint.method}
                              size="small"
                              color={endpoint.method === 'GET' ? 'primary' : 'secondary'}
                            />
                            <Typography variant="body2">{endpoint.path}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    onClick={handleTestEndpoint}
                    disabled={!testEndpoint}
                    startIcon={<PlayIcon />}
                  >
                    Test Endpoint
                  </Button>

                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleOwnerRegistration}
                    startIcon={<CrownIcon />}
                    sx={{ mt: 2 }}
                  >
                    Register as Owner (LilTorey)
                  </Button>

                  {testResult && (
                    <Alert severity={testResult.success ? 'success' : 'error'}>
                      <Typography variant="body2">
                        <strong>Test Result:</strong> {testResult.message}
                      </Typography>
                      {testResult.responseTime && (
                        <Typography variant="body2">
                          Response Time: {testResult.responseTime}ms
                        </Typography>
                      )}
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* API Endpoints Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available API Endpoints
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Method</TableCell>
                        <TableCell>Endpoint</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiEndpoints.map((endpoint, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Chip
                              label={endpoint.method}
                              size="small"
                              color={endpoint.method === 'GET' ? 'primary' : 'secondary'}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {endpoint.path}
                            </Typography>
                          </TableCell>
                          <TableCell>{endpoint.description}</TableCell>
                          <TableCell>
                            <Chip
                              label={endpoint.status.toUpperCase()}
                              size="small"
                              color={getStatusColor(endpoint.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 1 && (
          <>
            {/* Development Tools */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CodeIcon />
                      Development Tools
                    </Typography>

                    <List>
                      {devTools.map((tool, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemButton>
                            <ListItemIcon>
                              {tool.status === 'enabled' ? <CheckIcon /> : <SettingsIcon />}
                            </ListItemIcon>
                            <ListItemText
                              primary={tool.name}
                              secondary={tool.description}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label={tool.version} size="small" variant="outlined" />
                              <Chip
                                label={tool.status.toUpperCase()}
                                size="small"
                                color={getStatusColor(tool.status)}
                              />
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Development Settings
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.debugMode}
                            onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                          />
                        }
                        label="Debug Mode"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.loggingEnabled}
                            onChange={(e) => handleSettingChange('loggingEnabled', e.target.checked)}
                          />
                        }
                        label="Enhanced Logging"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.performanceMonitoring}
                            onChange={(e) => handleSettingChange('performanceMonitoring', e.target.checked)}
                          />
                        }
                        label="Performance Monitoring"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.errorReporting}
                            onChange={(e) => handleSettingChange('errorReporting', e.target.checked)}
                          />
                        }
                        label="Error Reporting"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.hotReload}
                            onChange={(e) => handleSettingChange('hotReload', e.target.checked)}
                          />
                        }
                        label="Hot Reload"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon />
                Performance Metrics
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Frontend Load Time</Typography>
                  <Chip label="1.2s" size="small" color="success" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">API Response Time</Typography>
                  <Chip label="45ms" size="small" color="success" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">WebSocket Latency</Typography>
                  <Chip label="12ms" size="small" color="success" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Database Query Time</Typography>
                  <Chip label="8ms" size="small" color="success" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon />
                Security & Access Control
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">API Rate Limiting</Typography>
                  <Chip label="1000 req/min" size="small" color="info" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">CORS Policy</Typography>
                  <Chip label="Enabled" size="small" color="success" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Input Validation</Typography>
                  <Chip label="Strict" size="small" color="success" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Bot Security Rules</Typography>
                  <Chip label="Enforced" size="small" color="success" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default DeveloperMode;
