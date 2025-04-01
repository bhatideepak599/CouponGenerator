import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, List,
  Card, CardContent, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { admin } from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const [openNewCoupons, setOpenNewCoupons] = useState(false);
  const [openAssignedCoupons, setOpenAssignedCoupons] = useState(false);
  const [newCoupons, setNewCoupons] = useState([]);
  const [assignedCoupons, setAssignedCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await admin.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users');
      }
    };
    if(token!==null)
    fetchUsers();
  }, []);

  const fetchNewCoupons = async () => {
    try {
      const response = await admin.getNewCoupons();
      setNewCoupons(response.data);
      setOpenNewCoupons(true);
    } catch (err) {
      console.error('Failed to fetch new coupons');
    }
  };

  const fetchAssignedCoupons = async () => {
    try {
      const response = await admin.getAssignedCoupons();
      setAssignedCoupons(response.data);
      setOpenAssignedCoupons(true);
    } catch (err) {
      console.error('Failed to fetch assigned coupons');
    }
  };

  const handleAssignCoupon = async (couponId, userId) => {
    try {
      console.log(couponId,"   ",userId);
      
      await admin.assignCoupon(couponId, userId);
      alert('Coupon assigned successfully!');
      setOpenNewCoupons(false);
      fetchNewCoupons();
    } catch (err) {
      console.error('Failed to assign coupon');
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ marginBottom: 4 }}>
        <Toolbar>
          <LocalOfferIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CouponHub
          </Typography>
          <Box>
            {role === 'ROLE_ADMIN' && (
              <>
                <Button color="inherit" onClick={fetchNewCoupons}>
                  New Coupons
                </Button>
                <Button color="inherit" onClick={fetchAssignedCoupons}>
                  Assigned Coupons
                </Button>
              </>
            )}
            {token ? (
              <Button color="inherit" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/');
              }}>
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* New Coupons Modal */}
      <Dialog open={openNewCoupons} onClose={() => setOpenNewCoupons(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#009879', color: '#fff', textAlign: 'center' }}>New Coupons</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f3f4f6' }}>
          {newCoupons.length > 0 ? (
            <List>
              {newCoupons.map((coupon) => (
                <Card key={coupon.id} sx={{ mb: 2, boxShadow: 3, p: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">{coupon.code}</Typography>
                    <Typography variant="body2" color="textSecondary">Discount: <strong>{coupon.discountAmount}%</strong></Typography>

                    {/* User Dropdown Selection */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>Select User</InputLabel>
                      <Select
                        value={selectedUser[coupon.id] || ''}
                        onChange={(e) => setSelectedUser((prev) => ({ ...prev, [coupon.id]: e.target.value }))}
                        displayEmpty
                      >
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.email}>{user.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Assign Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2, width: '100%' }}
                      disabled={!selectedUser[coupon.id]}
                      onClick={() => handleAssignCoupon(coupon.id, selectedUser[coupon.id])}
                    >
                      Assign to User
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </List>
          ) : (
            <Typography textAlign="center" color="textSecondary">No new coupons available.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
          <Button onClick={() => setOpenNewCoupons(false)} variant="contained" color="error">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assigned Coupons Modal */}
      <Dialog open={openAssignedCoupons} onClose={() => setOpenAssignedCoupons(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#009879', color: '#fff', textAlign: 'center' }}>Assigned Coupons</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f3f4f6' }}>
          {assignedCoupons.length > 0 ? (
            <List>
              {assignedCoupons.map((coupon) => (
                <Card key={coupon.id} sx={{ mb: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">{coupon.code}</Typography>
                    <Typography variant="body2" color="textSecondary">Assigned to: <strong>{coupon.assignedTo}</strong></Typography>
                  </CardContent>
                </Card>
              ))}
            </List>
          ) : (
            <Typography textAlign="center" color="textSecondary">No assigned coupons available.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
          <Button onClick={() => setOpenAssignedCoupons(false)} variant="contained" color="error">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;