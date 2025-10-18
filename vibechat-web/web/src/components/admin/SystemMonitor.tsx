import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
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
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  activeConnections: number;
  uptime: string;
  loadAverage: number[];
  responseTime: number;
  errorRate: number;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  lastCheck: string;
  responseTime: number;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  service: string;
  message: string;
}

const SystemMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkIn: 0,
    networkOut: 0,
    activeConnections: 0,
    uptime: '0d 0h 0m',
    loadAverage: [0, 0, 0],
    responseTime: 0,
    errorRate: 0,
  });

  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchMetrics();
    fetchServices();
    fetchLogs();

    const interval = setInterval(() => {
      fetchMetrics();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // Simulate API call - replace with actual API call
      const newMetrics: SystemMetrics = {
        cpuUsage: Math.floor(Math.random() * 80) + 10,
        memoryUsage: Math.floor(Math.random() * 70) + 20,
        diskUsage: Math.floor(Math.random() * 60) + 30,
        networkIn: Math.floor(Math.random() * 1000) + 100,
        networkOut: Math.floor(Math.random() * 800) + 50,
        activeConnections: Math.floor(Math.random() * 50) + 10,
        uptime: '7d 14h 32m',
        loadAverage: [
          Math.random() * 2 + 0.5,
          Math.random() * 1.5 + 0.3,
          Math.random() * 1 + 0.2,
        ],
        responseTime: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.random() * 0.5,
      };

      setMetrics(newMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const fetchServices = async () => {
    try {
      // Simulate API call - replace with actual API call
      const mockServices: ServiceStatus[] = [
        {
          name: 'Frontend Server',
          status: 'online',
          uptime: '7d 14h 32m',
          lastCheck: new Date().toISOString(),
          responseTime: 45,
        },
        {
          name: 'Backend API',
          status: 'online',
          uptime: '7d 14h 28m',
          lastCheck: new Date().toISOString(),
          responseTime: 52,
        },
        {
          name: 'Database',
          status: 'online',
          uptime: '7d 14h 30m',
          lastCheck: new Date().toISOString(),
          responseTime: 12,
        },
        {
          name: 'WebSocket Server',
          status: 'online',
          uptime: '7d 14h 25m',
          lastCheck: new Date().toISOString(),
          responseTime: 8,
        },
        {
          name: 'Email Service',
          status: 'warning',
          uptime: '7d 12h 15m',
          lastCheck: new Date().toISOString(),
          responseTime: 150,
        },
        {
          name: 'File Storage',
          status: 'online',
          uptime: '7d 14h 32m',
          lastCheck: new Date().toISOString(),
          responseTime: 23,
        },
      ];

      setServices(mockServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      // Simulate API call - replace with actual API call
      const mockLogs: LogEntry[] = [
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
          level: 'info',
          service: 'Frontend',
          message: 'User authentication successful',
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          level: 'warning',
          service: 'Backend',
          message: 'High memory usage detected',
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
          level: 'info',
          service: 'Database',
          message: 'Database connection established',
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          level: 'error',
          service: 'Email Service',
          message: 'SMTP connection timeout',
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          level: 'info',
          service: 'WebSocket',
          message: 'New room connection established',
        },
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'warning': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckIcon />;
      case 'warning': return <WarningIcon />;
      case 'offline': return <ErrorIcon />;
      default: return <MonitorIcon />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (uptime: string) => {
    return uptime;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              System Monitor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time system performance and service monitoring
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                fetchMetrics();
                fetchServices();
                fetchLogs();
              }}
            >
              Refresh All
            </Button>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        {/* System Overview */}
        <Alert
          severity={metrics.cpuUsage > 80 || metrics.memoryUsage > 80 ? 'warning' : 'success'}
          sx={{ mb: 4 }}
        >
          <Typography variant="body1">
            <strong>System Status:</strong> {metrics.cpuUsage > 80 || metrics.memoryUsage > 80 ? 'WARNING' : 'HEALTHY'}
          </Typography>
          <Typography variant="body2">
            CPU: {metrics.cpuUsage}% • Memory: {metrics.memoryUsage}% • Response Time: {metrics.responseTime}ms
          </Typography>
        </Alert>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<MonitorIcon />} label="Overview" />
            <Tab icon={<SettingsIcon />} label="Services" />
            <Tab icon={<TimelineIcon />} label="Logs" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        {activeTab === 0 && (
          <>
            {/* System Metrics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography color="text.secondary" gutterBottom>
                        CPU Usage
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {metrics.cpuUsage}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.cpuUsage}
                      color={metrics.cpuUsage > 80 ? 'error' : metrics.cpuUsage > 60 ? 'warning' : 'success'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MemoryIcon sx={{ mr: 1, color: 'success.main' }} />
                      <Typography color="text.secondary" gutterBottom>
                        Memory Usage
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {metrics.memoryUsage}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.memoryUsage}
                      color={metrics.memoryUsage > 80 ? 'error' : metrics.memoryUsage > 60 ? 'warning' : 'success'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StorageIcon sx={{ mr: 1, color: 'info.main' }} />
                      <Typography color="text.secondary" gutterBottom>
                        Disk Usage
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {metrics.diskUsage}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.diskUsage}
                      color={metrics.diskUsage > 80 ? 'error' : metrics.diskUsage > 60 ? 'warning' : 'success'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <NetworkIcon sx={{ mr: 1, color: 'warning.main' }} />
                      <Typography color="text.secondary" gutterBottom>
                        Active Connections
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {metrics.activeConnections}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {metrics.responseTime}ms avg response
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Network and Load Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NetworkIcon />
                      Network Traffic
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Incoming</Typography>
                          <Typography variant="body2">{formatBytes(metrics.networkIn)}/s</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={65} color="success" />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Outgoing</Typography>
                          <Typography variant="body2">{formatBytes(metrics.networkOut)}/s</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={45} color="warning" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AnalyticsIcon />
                      System Load
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Load Average (1m)</Typography>
                        <Chip label={metrics.loadAverage[0].toFixed(2)} size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Load Average (5m)</Typography>
                        <Chip label={metrics.loadAverage[1].toFixed(2)} size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Load Average (15m)</Typography>
                        <Chip label={metrics.loadAverage[2].toFixed(2)} size="small" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon />
                Service Status
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Uptime</TableCell>
                      <TableCell>Response Time</TableCell>
                      <TableCell>Last Check</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.name} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {getStatusIcon(service.status)}
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {service.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={service.status.toUpperCase()}
                            color={getStatusColor(service.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatUptime(service.uptime)}</TableCell>
                        <TableCell>{service.responseTime}ms</TableCell>
                        <TableCell>{new Date(service.lastCheck).toLocaleTimeString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon />
                Recent System Logs
              </Typography>

              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {logs.map((log, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Avatar sx={{ bgcolor: `${getLogLevelColor(log.level)}.main`, width: 32, height: 32 }}>
                      {log.level === 'error' && <ErrorIcon />}
                      {log.level === 'warning' && <WarningIcon />}
                      {log.level === 'info' && <CheckIcon />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {log.service}
                        </Typography>
                        <Chip label={log.level.toUpperCase()} size="small" color={getLogLevelColor(log.level)} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {log.message}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon />
                    Performance Trends
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Error Rate</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{(metrics.errorRate * 100).toFixed(2)}%</Typography>
                        <TrendingDownIcon color="success" />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Avg Response Time</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{metrics.responseTime}ms</Typography>
                        <TrendingUpIcon color="warning" />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Active Users</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{metrics.activeConnections}</Typography>
                        <TrendingUpIcon color="success" />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon />
                    Security Overview
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Failed Login Attempts</Typography>
                      <Chip label="0" size="small" color="success" />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Suspicious Activities</Typography>
                      <Chip label="0" size="small" color="success" />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Security Incidents</Typography>
                      <Chip label="0" size="small" color="success" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default SystemMonitor;
