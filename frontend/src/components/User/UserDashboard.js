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
} from '@mui/material';
import { user } from '../../services/api';

const UserDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await user.getCoupons();
      setCoupons(response.data);
    } catch (err) {
      setError('Failed to fetch coupons');
    }
  };

  const handleUseCoupon = async (coupon) => {
    try {
      await user.useCoupon(coupon.code);
      setOpenDialog(false);
      fetchCoupons(); // Refresh coupons list
    } catch (err) {
      setError('Failed to use coupon');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Coupons
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        {coupons.map((coupon) => (
          <Grid item xs={12} sm={6} md={4} key={coupon.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: coupon.used ? 'grey.100' : 'background.paper'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {coupon.code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {coupon.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Discount: ${coupon.discountAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expires: {formatDate(coupon.expiryDate)}
                </Typography>
                <Typography variant="body2" color={coupon.used ? 'error' : 'success'}>
                  Status: {coupon.used ? 'Used' : 'Active'}
                </Typography>
                {!coupon.used && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setOpenDialog(true);
                    }}
                  >
                    Use Coupon
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Coupon Usage</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to use coupon {selectedCoupon?.code}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleUseCoupon(selectedCoupon)}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard;
