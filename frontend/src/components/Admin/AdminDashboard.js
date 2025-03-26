import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { admin } from '../../services/api';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    description: '',
    discountAmount: '',
    expiryDate: new Date(),
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

  const handleGenerateCoupon = async () => {
    try {
      const response = await admin.generateCoupon(couponForm);
      setSelectedCoupon(response.data);
      setOpenCouponDialog(false);
      setOpenAssignDialog(true);
    } catch (err) {
      setError('Failed to generate coupon');
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.approved ? 'Approved' : 'Pending'}
                      </TableCell>
                      <TableCell>
                        {!user.approved && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
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

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => setOpenCouponDialog(true)}
      >
        Generate New Coupon
      </Button>

      {/* Generate Coupon Dialog */}
      <Dialog open={openCouponDialog} onClose={() => setOpenCouponDialog(false)}>
        <DialogTitle>Generate New Coupon</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={couponForm.description}
            onChange={(e) =>
              setCouponForm({ ...couponForm, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Discount Amount"
            type="number"
            fullWidth
            value={couponForm.discountAmount}
            onChange={(e) =>
              setCouponForm({ ...couponForm, discountAmount: e.target.value })
            }
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Expiry Date"
              value={couponForm.expiryDate}
              onChange={(newValue) =>
                setCouponForm({ ...couponForm, expiryDate: newValue })
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCouponDialog(false)}>Cancel</Button>
          <Button onClick={handleGenerateCoupon} variant="contained">
            Generate
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
};

export default AdminDashboard;
