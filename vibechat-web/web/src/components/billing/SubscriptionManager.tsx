import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Star as StarIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Payment as PaymentIcon,
  Speed as SpeedIcon,
  Hd as HdIcon,
  FourK as FourKIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';

const SubscriptionManager: React.FC = () => {
  const { user } = useAuthStore();
  const {
    subscriptions,
    availableTiers,
    paymentMethods,
    btcWallet,
    isLoading,
    error,
    fetchSubscriptions,
    fetchAvailableTiers,
    fetchPaymentMethods,
    purchaseSubscription,
    cancelSubscription,
    clearError,
  } = useSubscriptionStore();

  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('BTC');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    fetchAvailableTiers();
    fetchPaymentMethods();
  }, [fetchSubscriptions, fetchAvailableTiers, fetchPaymentMethods]);

  const handlePurchase = async (tier: string) => {
    setSelectedTier(tier);
    setPaymentDialogOpen(true);
  };

  const handlePaymentConfirm = async () => {
    if (!paymentDetails.trim()) {
      return;
    }

    setProcessingPayment(true);

    try {
      await purchaseSubscription({
        tier: selectedTier as any,
        paymentMethod: selectedPaymentMethod as any,
        paymentDetails: paymentDetails.trim(),
      });

      setPaymentDialogOpen(false);
      setPaymentDetails('');
      setSelectedTier('');
      setSelectedPaymentMethod('BTC');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      await cancelSubscription(subscriptionId);
    } catch (error) {
      console.error('Cancellation failed:', error);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'BOOST_PLUS_TIER_2':
        return <SpeedIcon />;
      case 'BOOST_PLUS_TIER_3':
        return <HdIcon />;
      case 'BOOST_PLUS_TIER_4':
        return <FourKIcon />;
      case 'BOOST_PLUS_TIER_5':
        return <StarIcon />;
      default:
        return <CheckIcon />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BOOST_PLUS_TIER_2':
        return 'primary';
      case 'BOOST_PLUS_TIER_3':
        return 'secondary';
      case 'BOOST_PLUS_TIER_4':
        return 'warning';
      case 'BOOST_PLUS_TIER_5':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTierDisplayName = (tier: string) => {
    const tierInfo = availableTiers[tier];
    return tierInfo?.name || tier;
  };

  const getTierFeatures = (tier: string) => {
    const tierInfo = availableTiers[tier];
    return tierInfo?.features || '';
  };

  if (isLoading && subscriptions.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <div className="spinner" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <PaymentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom className="gradient-text">
              BOOST+ Subscriptions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Unlock premium streaming features and enhanced capabilities
            </Typography>
          </Box>
        </Box>

        {/* Current Subscriptions */}
        {subscriptions.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Active Subscriptions
              </Typography>
              <List>
                {subscriptions.map((subscription) => (
                  <ListItem key={subscription.id} divider>
                    <ListItemIcon>
                      {getTierIcon(subscription.tier)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {getTierDisplayName(subscription.tier)}
                          </Typography>
                          <Chip
                            label={subscription.status}
                            color={subscription.status === 'ACTIVE' ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {subscription.features}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Valid until: {new Date(subscription.endDate || '').toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    {subscription.status === 'ACTIVE' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelSubscription(subscription.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Available Tiers */}
        <Typography variant="h6" gutterBottom>
          Available BOOST+ Tiers
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(availableTiers)
            .filter(([tier]) => tier !== 'FREE')
            .map(([tier, tierInfo]) => (
              <Grid item xs={12} md={6} key={tier}>
                <Card
                  className="card-3d"
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${
                      tier === 'BOOST_PLUS_TIER_2' ? '#8B5CF6' :
                      tier === 'BOOST_PLUS_TIER_3' ? '#EC4899' :
                      tier === 'BOOST_PLUS_TIER_4' ? '#F59E0B' : '#EF4444'
                    } 0%, rgba(15, 23, 42, 0.9) 100%)`,
                  }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getTierIcon(tier)}
                      <Typography variant="h6" sx={{ ml: 1, color: 'white' }}>
                        {tierInfo.name}
                      </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                      ${tierInfo.price}
                      <Typography variant="body2" component="span" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        /month
                      </Typography>
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, flexGrow: 1 }}>
                      {tierInfo.features}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handlePurchase(tier)}
                      disabled={subscriptions.some(sub => sub.tier === tier && sub.status === 'ACTIVE')}
                      sx={{
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      {subscriptions.some(sub => sub.tier === tier && sub.status === 'ACTIVE')
                        ? 'Already Subscribed'
                        : 'Subscribe Now'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon />
              Purchase BOOST+ Subscription
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTier && availableTiers[selectedTier] && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {availableTiers[selectedTier].name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {availableTiers[selectedTier].features}
                </Typography>

                {/* Payment Method Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    label="Payment Method"
                  >
                    {Object.entries(paymentMethods).map(([method, info]) => (
                      <MenuItem key={method} value={method}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {method === 'BTC' && <PaymentIcon />}
                          {method === 'CREDIT_CARD' && <CreditCardIcon />}
                          {method === 'DEBIT_CARD' && <BankIcon />}
                          {method === 'PAYPAL' && <PaymentIcon />}
                          {info.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Payment Details Based on Method */}
                {selectedPaymentMethod === 'BTC' && (
                  <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>Bitcoin Payment</strong><br />
                        Send ${availableTiers[selectedTier].price} to wallet: <code>{btcWallet}</code>
                      </Typography>
                    </Alert>

                    <TextField
                      fullWidth
                      label="Bitcoin Transaction ID"
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      placeholder="Enter your BTC transaction ID"
                      sx={{ mb: 2 }}
                    />

                    <Alert severity="warning">
                      <Typography variant="body2">
                        Please wait for 1-3 confirmations before entering your transaction ID.
                        Your subscription will be activated once payment is verified.
                      </Typography>
                    </Alert>
                  </Box>
                )}

                {(selectedPaymentMethod === 'CREDIT_CARD' || selectedPaymentMethod === 'DEBIT_CARD') && (
                  <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>{selectedPaymentMethod === 'CREDIT_CARD' ? 'Credit Card' : 'Debit Card'} Payment</strong><br />
                        All funds will be converted to BTC and deposited to: <code>{btcWallet}</code>
                      </Typography>
                    </Alert>

                    <TextField
                      fullWidth
                      label="Card Details"
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      placeholder="Card number, expiry, CVV"
                      sx={{ mb: 2 }}
                    />

                    <Alert severity="info">
                      <Typography variant="body2">
                        This is a demo - in production, integrate with Stripe/PayPal for real card processing.
                      </Typography>
                    </Alert>
                  </Box>
                )}

                {selectedPaymentMethod === 'PAYPAL' && (
                  <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>PayPal Payment</strong><br />
                        Funds will be converted to BTC and deposited to: <code>{btcWallet}</code>
                      </Typography>
                    </Alert>

                    <TextField
                      fullWidth
                      label="PayPal Transaction ID"
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      placeholder="Enter your PayPal transaction ID"
                      sx={{ mb: 2 }}
                    />

                    <Alert severity="info">
                      <Typography variant="body2">
                        This is a demo - in production, integrate with PayPal API for real processing.
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePaymentConfirm}
              variant="contained"
              disabled={!paymentDetails.trim() || processingPayment}
            >
              {processingPayment ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default SubscriptionManager;
