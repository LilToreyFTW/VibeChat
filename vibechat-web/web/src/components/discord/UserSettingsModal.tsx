import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Notifications as BellIcon,
  Keyboard as KeyboardIcon,
  Language as LanguageIcon,
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

// API service
import { apiService } from '../../services/api';

interface UserSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [walletAddress, setWalletAddress] = useState('1M9mactBVv4ygScFxzHbEsXHcvvH8WrvPG');
  const [payoutInfo, setPayoutInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Load payout info when component mounts or tab changes to B00ST+
  useEffect(() => {
    if (open && tabValue === 6) { // B00ST+ tab
      loadPayoutInfo();
    }
  }, [open, tabValue]);

  const loadPayoutInfo = async () => {
    setLoading(true);
    setError('');
    try {
      // In a real app, get user ID from auth store
      const userId = 'current-user-id'; // Replace with actual user ID
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/billing/payout-info?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPayoutInfo(data.data);
        setWalletAddress(data.data.wallet_address);
      }
    } catch (err: any) {
      setError('Failed to load payout information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a valid Bitcoin wallet address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, get user ID from auth store
      const userId = 'current-user-id'; // Replace with actual user ID
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/billing/update-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          user_id: userId
        }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Bitcoin wallet address updated successfully!');
        setPayoutInfo(data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update wallet address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          maxHeight: '90vh',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            User Settings
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
            <Tab
              icon={<PersonIcon />}
              label="My Account"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
            <Tab
              icon={<SecurityIcon />}
              label="Privacy & Safety"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
            <Tab
              icon={<PaletteIcon />}
              label="Appearance"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
            <Tab
              icon={<BellIcon />}
              label="Notifications"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
            <Tab
              icon={<KeyboardIcon />}
              label="Keybinds"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
            <Tab
              icon={<LanguageIcon />}
              label="Language"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
            <Tab
              icon={<CreditCardIcon />}
              label="B00ST+"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
            <Tab
              icon={<SettingsIcon />}
              label="Advanced"
              sx={{
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* My Account Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Profile Picture */}
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: '2rem',
                    mb: 2,
                  }}
                >
                  Y
                </Avatar>
                <Button variant="outlined" size="small">
                  Change Avatar
                </Button>
              </Box>

              {/* Account Info */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Username"
                  defaultValue="YourUsername"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Display Name"
                  defaultValue="Your Display Name"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  defaultValue="user@example.com"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone Number"
                  defaultValue=""
                  fullWidth
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained">Save Changes</Button>
                  <Button variant="outlined" color="error">
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Privacy & Safety Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Privacy Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow direct messages from server members"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow friend requests"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Show current game activity"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow @everyone and @here pings"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Safety Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable explicit content filter"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Scan message attachments for malware"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Safe direct messaging for users under 18"
                />
              </Box>
            </Box>
          </TabPanel>

          {/* Appearance Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Theme
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant={theme.palette.mode === 'dark' ? 'contained' : 'outlined'}
                  sx={{ flex: 1 }}
                >
                  Dark Theme
                </Button>
                <Button
                  variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
                  sx={{ flex: 1 }}
                >
                  Light Theme
                </Button>
              </Box>

              <Typography variant="h6" gutterBottom>
                Message Display
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show compact mode"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show link previews"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Animate emojis"
                />
              </Box>
            </Box>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Desktop Notifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable desktop notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Play notification sounds"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show unread badge on dock"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notify on @mentions"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Notify on all messages"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notify on friend requests"
                />
              </Box>
            </Box>
          </TabPanel>

          {/* Keybinds Tab */}
          <TabPanel value={tabValue} index={4}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Keyboard Shortcuts
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Toggle Mute"
                    secondary="Ctrl + Shift + M"
                  />
                  <Button size="small">Edit</Button>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Toggle Deafen"
                    secondary="Ctrl + Shift + D"
                  />
                  <Button size="small">Edit</Button>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Push to Talk"
                    secondary="Hold V"
                  />
                  <Button size="small">Edit</Button>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Mark as Read"
                    secondary="Escape"
                  />
                  <Button size="small">Edit</Button>
                </ListItem>
              </List>
            </Box>
          </TabPanel>

          {/* Language Tab */}
          <TabPanel value={tabValue} index={5}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Language Settings
              </Typography>
              <TextField
                select
                label="Display Language"
                defaultValue="en-US"
                fullWidth
                sx={{ mb: 2 }}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
                <option value="de-DE">Deutsch</option>
              </TextField>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Use system language"
              />
            </Box>
          </TabPanel>

          {/* B00ST+ Tab */}
          <TabPanel value={tabValue} index={6}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Current Plan: Basic
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" color="primary">
                    Basic
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Free • Custom Emojis
                  </Typography>
                  <Button variant="outlined" size="small">
                    Current Plan
                  </Button>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6">
                    Classic
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    $9.99/mo • HD Streaming
                  </Typography>
                  <Button variant="contained" size="small">
                    Upgrade
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Bitcoin Wallet Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                All B00ST+ tier purchases are automatically paid out to your configured Bitcoin wallet address.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  label="Bitcoin Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.default',
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                    },
                  }}
                  helperText="This is where all your B00ST+ earnings will be sent"
                />
                <Button
                  variant="contained"
                  sx={{ minWidth: 100 }}
                  onClick={handleUpdateWallet}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </Box>

              {/* Status Messages */}
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

              <Typography variant="h6" gutterBottom>
                Payout Information
              </Typography>
              <Box sx={{ backgroundColor: 'background.default', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Current Balance:</strong> {payoutInfo?.current_balance || '0.00000000 BTC'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Pending Payouts:</strong> {payoutInfo?.pending_payouts || '0.00000000 BTC'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Last Payout:</strong> {payoutInfo?.last_payout || 'Never'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Total Earned:</strong> {payoutInfo?.total_earned || '0.00000000 BTC'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Payouts are processed automatically every 24 hours for balances over {payoutInfo?.minimum_payout || '0.001 BTC'}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Billing Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No payment method on file
              </Typography>
              <Button variant="outlined" sx={{ mt: 1 }}>
                Add Payment Method
              </Button>
            </Box>
          </TabPanel>

          {/* Advanced Tab */}
          <TabPanel value={tabValue} index={7}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Advanced Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch />}
                  label="Developer Mode"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Hardware Acceleration"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable beta features"
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                Danger Zone
                </Typography>
                <Button variant="outlined" color="error">
                  Log Out
                </Button>
                <Button variant="contained" color="error">
                  Delete Account
                </Button>
              </Box>
            </Box>
          </TabPanel>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Version 1.0.0
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">
              Help
            </Button>
            <Button variant="contained" size="small">
              Done
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserSettingsModal;
