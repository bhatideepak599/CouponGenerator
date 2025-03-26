import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiscountIcon from '@mui/icons-material/Discount';
import SavingsIcon from '@mui/icons-material/Savings';
import Navbar from '../common/Navbar';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalOfferIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Generate Coupons',
      description: 'Create unique and secure coupon codes instantly'
    },
    {
      icon: <DiscountIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Manage Discounts',
      description: 'Set and control discount percentages easily'
    },
    {
      icon: <SavingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Track Savings',
      description: 'Monitor and analyze coupon usage and savings'
    }
  ];

  return (
    <>
      <Navbar />
      <Container>
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          borderRadius: 2,
          color: 'white',
          mb: 6
        }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to CouponHub
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Your One-Stop Solution for Coupon Management
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              color="inherit"
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s'
                }
              }}>
                <Box sx={{ my: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h4" gutterBottom>
            Ready to Start?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of businesses managing their coupons effectively
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/register')}
          >
            Create Your Account Now
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home;
