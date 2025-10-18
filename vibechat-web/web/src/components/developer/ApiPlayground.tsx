import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Api as ApiIcon,
  Code as CodeIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
  timestamp: string;
}

const ApiPlayground: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [request, setRequest] = useState<ApiRequest>({
    method: 'GET',
    url: '',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
    },
    body: '',
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ request: ApiRequest; response: ApiResponse }>>([]);

  const commonEndpoints = [
    { method: 'GET', path: '/api/rooms/my-rooms', description: 'Get user\'s rooms' },
    { method: 'POST', path: '/api/rooms', description: 'Create new room' },
    { method: 'GET', path: '/api/bots/my-bots', description: 'Get user\'s bots' },
    { method: 'POST', path: '/api/bots', description: 'Create new bot' },
    { method: 'POST', path: '/api/auth/login', description: 'User authentication' },
    { method: 'POST', path: '/api/auth/register', description: 'User registration' },
    { method: 'GET', path: '/api/ai/generate-room-link', description: 'Generate room link' },
    { method: 'POST', path: '/api/ai/analyze-text', description: 'AI text analysis' },
  ];

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const mockResponse: ApiResponse = {
        status: request.method === 'POST' ? 201 : 200,
        statusText: request.method === 'POST' ? 'Created' : 'OK',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          message: 'API request successful',
          data: {
            example: 'response data',
            timestamp: new Date().toISOString(),
          },
        }, null, 2),
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };

      setResponse(mockResponse);

      // Add to history
      setHistory(prev => [...prev.slice(-9), { request: { ...request }, response: mockResponse }]);
    } catch (error) {
      const errorResponse: ApiResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        body: JSON.stringify({
          success: false,
          message: 'API request failed',
          error: error,
        }, null, 2),
        responseTime: Date.now() - Date.now(),
        timestamp: new Date().toISOString(),
      };

      setResponse(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadEndpoint = (endpoint: { method: string; path: string }) => {
    setRequest(prev => ({
      ...prev,
      method: endpoint.method as any,
      url: `http://localhost:8080${endpoint.path}`,
    }));
  };

  const handleCopyResponse = () => {
    if (response?.body) {
      navigator.clipboard.writeText(response.body);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ApiIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              API Playground
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Interactive API testing environment for developers
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<CodeIcon />} label="Request Builder" />
            <Tab icon={<ApiIcon />} label="API Reference" />
            <Tab icon={<RefreshIcon />} label="Request History" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon />
                    Request Builder
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Method and URL */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Method</InputLabel>
                        <Select
                          value={request.method}
                          onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value as any }))}
                          label="Method"
                        >
                          <MenuItem value="GET">GET</MenuItem>
                          <MenuItem value="POST">POST</MenuItem>
                          <MenuItem value="PUT">PUT</MenuItem>
                          <MenuItem value="DELETE">DELETE</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Request URL"
                        value={request.url}
                        onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://api.example.com/endpoint"
                      />
                    </Box>

                    {/* Headers */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Headers</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {Object.entries(request.headers).map(([key, value]) => (
                            <Box key={key} sx={{ display: 'flex', gap: 2 }}>
                              <TextField
                                size="small"
                                label="Header Name"
                                value={key}
                                onChange={(e) => {
                                  const newHeaders = { ...request.headers };
                                  delete newHeaders[key];
                                  newHeaders[e.target.value] = value;
                                  setRequest(prev => ({ ...prev, headers: newHeaders }));
                                }}
                              />
                              <TextField
                                size="small"
                                label="Header Value"
                                value={value}
                                onChange={(e) => {
                                  setRequest(prev => ({
                                    ...prev,
                                    headers: { ...prev.headers, [key]: e.target.value }
                                  }));
                                }}
                                fullWidth
                              />
                            </Box>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* Request Body */}
                    {(request.method === 'POST' || request.method === 'PUT') && (
                      <TextField
                        label="Request Body (JSON)"
                        value={request.body}
                        onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                        multiline
                        rows={8}
                        fullWidth
                        placeholder='{"key": "value"}'
                      />
                    )}

                    <Button
                      variant="contained"
                      onClick={handleSendRequest}
                      disabled={loading || !request.url}
                      startIcon={loading ? <RefreshIcon /> : <PlayIcon />}
                      size="large"
                    >
                      {loading ? 'Sending...' : 'Send Request'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Endpoints
                  </Typography>

                  <List dense>
                    {commonEndpoints.map((endpoint, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => handleLoadEndpoint(endpoint)}>
                          <ListItemIcon>
                            <Chip
                              label={endpoint.method}
                              size="small"
                              color={endpoint.method === 'GET' ? 'primary' : 'secondary'}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={endpoint.path}
                            secondary={endpoint.description}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Reference Documentation
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> All API endpoints require authentication with a Bearer token in the Authorization header.
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                {[
                  {
                    title: 'Authentication',
                    endpoints: [
                      { method: 'POST', path: '/api/auth/login', description: 'Authenticate user and get JWT token' },
                      { method: 'POST', path: '/api/auth/register', description: 'Register new user account' },
                      { method: 'POST', path: '/api/auth/validate', description: 'Validate JWT token' },
                    ],
                  },
                  {
                    title: 'Room Management',
                    endpoints: [
                      { method: 'GET', path: '/api/rooms/my-rooms', description: 'Get user\'s created rooms' },
                      { method: 'POST', path: '/api/rooms', description: 'Create new chat room' },
                      { method: 'PUT', path: '/api/rooms/{id}', description: 'Update room settings' },
                      { method: 'DELETE', path: '/api/rooms/{id}', description: 'Delete room' },
                    ],
                  },
                  {
                    title: 'Bot Management',
                    endpoints: [
                      { method: 'GET', path: '/api/bots/my-bots', description: 'Get user\'s created bots' },
                      { method: 'POST', path: '/api/bots', description: 'Create new AI bot' },
                      { method: 'PUT', path: '/api/bots/{id}', description: 'Update bot settings' },
                      { method: 'DELETE', path: '/api/bots/{id}', description: 'Delete bot' },
                    ],
                  },
                  {
                    title: 'AI Services',
                    endpoints: [
                      { method: 'GET', path: '/api/ai/generate-room-link', description: 'Generate unique room code' },
                      { method: 'POST', path: '/api/ai/analyze-text', description: 'AI-powered text analysis' },
                    ],
                  },
                ].map((category, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          {category.title}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {category.endpoints.map((endpoint, endpointIndex) => (
                            <Box
                              key={endpointIndex}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                              }}
                            >
                              <Chip
                                label={endpoint.method}
                                size="small"
                                color={endpoint.method === 'GET' ? 'primary' : 'secondary'}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {endpoint.path}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {endpoint.description}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Request History
              </Typography>

              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {history.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No requests in history yet. Make some API calls to see them here.
                  </Typography>
                ) : (
                  history.map((item, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={item.request.method}
                            size="small"
                            color={item.request.method === 'GET' ? 'primary' : 'secondary'}
                          />
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {item.request.url}
                          </Typography>
                          <Chip
                            label={item.response.status}
                            size="small"
                            color={getStatusColor(item.response.status)}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {item.response.responseTime}ms
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Typography variant="subtitle2">Response</Typography>
                          <Box sx={{ position: 'relative' }}>
                            <IconButton
                              size="small"
                              onClick={handleCopyResponse}
                              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                            <Typography component="code" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                              {item.response.body}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Response Display */}
        {response && activeTab === 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Response</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`${response.status} ${response.statusText}`}
                    color={getStatusColor(response.status)}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {response.responseTime}ms
                  </Typography>
                  <IconButton size="small" onClick={handleCopyResponse}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Response Headers
              </Typography>
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
                {Object.entries(response.headers).map(([key, value]) => (
                  <Typography key={key} variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {key}: {value}
                  </Typography>
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Response Body
              </Typography>
              <Box sx={{ bgcolor: 'grey.900', color: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                {response.body}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default ApiPlayground;
