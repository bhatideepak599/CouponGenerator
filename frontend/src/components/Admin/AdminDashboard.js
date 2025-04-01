import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { admin } from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponData, setCouponData] = useState({
    description: '',
    expiryDate: '',
    discountPercentage: '',
    count: '1',
  });
  const [assignEmail, setAssignEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await admin.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await admin.approveUser(userId);
      fetchUsers();
    } catch (err) {
      setError('Failed to approve user');
    }
  };

  const handleGenerateCoupons = async () => {
    try {
      // TODO: Implement bulk coupon generation
      const response = await admin.generateCoupon({
        description: couponData.description,
        expiryDate: new Date(couponData.expiryDate),
        discountAmount: parseInt(couponData.discountPercentage),
        count: parseInt(couponData.count),
      });
      setOpenCouponDialog(false);
      // Refresh the coupons list
      fetchUsers();
    } catch (err) {
      setError('Failed to generate coupons');
    }
  };

  const handleAssignCoupon = async () => {
    try {
      await admin.assignCoupon(selectedCoupon.id, assignEmail);
      setOpenAssignDialog(false);
      setSelectedCoupon(null);
      setAssignEmail('');
    } catch (err) {
      setError('Failed to assign coupon');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Admin Dashboard
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<LocalOfferIcon />}
                    onClick={() => setOpenCouponDialog(true)}
                  >
                    Generate Coupons
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* User Management */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                User Management
              </Typography>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.approved ? 'Approved' : 'Pending'}</TableCell>
                        <TableCell>
                          {!user.approved && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<PersonAddIcon />}
                              onClick={() => handleApproveUser(user.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Assign Coupon Dialog */}
        <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
          <DialogTitle>Assign Coupon</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Coupon Code: {selectedCoupon?.code}
            </Typography>
            <TextField
              margin="dense"
              label="User Email"
              fullWidth
              value={assignEmail}
              onChange={(e) => setAssignEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignCoupon} variant="contained">
              Assign
            </Button>
          </DialogActions>
        </Dialog>

        {/* Coupon Generation Dialog */}
        <Dialog open={openCouponDialog} onClose={() => setOpenCouponDialog(false)}>
          <DialogTitle>Generate Coupons</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
            <TextField
                fullWidth
                label="Number of Coupons to be generated"
                type="number"
                value={couponData.count}
                onChange={(e) => setCouponData({ ...couponData, count: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Coupon Description"
                type="text"
                value={couponData.description}
                onChange={(e) => setCouponData({ ...couponData, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={couponData.expiryDate}
                onChange={(e) => setCouponData({ ...couponData, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Discount Percentage"
                type="number"
                value={couponData.discountPercentage}
                onChange={(e) => setCouponData({ ...couponData, discountPercentage: e.target.value })}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCouponDialog(false)}>Cancel</Button>
            <Button onClick={handleGenerateCoupons} variant="contained" color="primary">
              Generate
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminDashboard;