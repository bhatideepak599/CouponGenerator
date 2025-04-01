import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { user } from '../../services/api';
import Navbar from '../common/Navbar';

const UserDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await user.getCoupons();
      
      
      setCoupons(response.data);
    } catch (err) {
      setError('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCoupon = async (coupon) => {
    try {
      await user.useCoupon(coupon.id);
      setOpenDialog(false);
      fetchCoupons(); 
    } catch (err) {
      setError('Failed to use coupon');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <CardGiftcardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              My Coupons
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage your available coupons
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : coupons.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
            <CardGiftcardIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Coupons Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You don't have any coupons yet. Check back later for new offers!
            </Typography>
          </Paper>
        ) : (

        <Grid container spacing={3}>
          {coupons.map((coupon) => (
            <Grid item xs={12} sm={6} md={4} key={coupon.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                  bgcolor: coupon.used ? 'grey.50' : 'background.paper',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                      {coupon.code}
                    </Typography>
                    <Chip
                      label={coupon.status=='USED' ? 'Used' : 'Active'}
                      color={coupon.status=='USED' ? 'default' : 'success'}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {coupon.description}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon color="primary" fontSize="small" />
                        <Typography variant="body2">
                          Discount: ${coupon.discountAmount}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon color="primary" fontSize="small" />
                        <Typography variant="body2">
                          Expires: {formatDate(coupon.expiryDate)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {coupon.status!="USED" && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<LocalOfferIcon />}
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setOpenDialog(true);
                        }}
                      >
                        Use Coupon
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxWidth: 400
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Use Coupon
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to use this coupon?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone.
              </Typography>
              {selectedCoupon && (
                <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Coupon Details:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalOfferIcon fontSize="small" />
                    <Typography variant="body2">{selectedCoupon.code}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <AttachMoneyIcon fontSize="small" />
                    <Typography variant="body2">Discount: ${selectedCoupon.discountAmount}</Typography>
                  </Box>
                </Paper>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleUseCoupon(selectedCoupon)}
              variant="contained"
              color="primary"
            >
              Confirm Use
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default UserDashboard;
