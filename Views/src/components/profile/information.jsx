
import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Work,
  LocationOn,
  CheckCircle,
  Cancel,
  Security,
  Badge,
  Edit
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';
import AuthService from '../../utils/auth';

const Profile = ({ onEditInformation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staffLocation, setStaffLocation] = useState('');
  const [error, setError] = useState(null);
  
  const handleEditInformation = () => {
    if (typeof onEditInformation === 'function') {
      onEditInformation();
    } else {
      console.warn('onEditInformation function not provided' + error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const authStatus = await AuthService.checkAuthStatus();
        console.log('Auth status:', authStatus);
        
        if (authStatus.success && authStatus.isLoggedIn) {
          setUserEmail(authStatus.email);
          
          
          const userJson = await fetch(`${GetApi.api}/staff/information/${authStatus.email}`, {
            credentials: 'include'
          });
          
          if (!userJson.ok) {
            throw new Error(`HTTP error! status: ${userJson.status}`);
          }
          
          const userget = await userJson.json();
          console.log('Staff information:', userget);
          
          
          if (userget.staff) {
            setStaffInfo(userget.staff);
            setStaffLocation(userget.location);
          } else {
            throw new Error('Invalid staff information format');
          }
        } else {
          setError('User not logged in');
        }
      } catch (error) {
        console.error('Failed to fetch staff information:', error);
        setError(`Failed to load information: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);




  const getLocationCity = () => {
    const location = staffLocation || '';
    const parts = location.split(',');
    return parts[1]?.trim() || 'New York';
  };

  const getEmailUsername = () => {
    const email = staffInfo?.email || '';
    return email.split('@')[0] || email;
  };

  
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" color="primary">
          User Dashboard
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleEditInformation}
          startIcon={<Edit />}
        >
          Change Information
        </Button>
      </Box>

      
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                {staffInfo?.name || 'User'}
              </Typography>
              
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
                {staffInfo?.job || 'Employee'} • {getLocationCity()}
              </Typography>
              
              <Chip 
                label={staffInfo?.status ? "Active Account" : "Inactive Account"}
                color={staffInfo?.status ? "success" : "error"}
                icon={staffInfo?.status ? <CheckCircle /> : <Cancel />}
                sx={{ 
                  backgroundColor: staffInfo?.status ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                  color: 'white',
                  fontSize: '1rem',
                  padding: '8px 16px'
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <Badge sx={{ mr: 1 }} />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              

              <Grid container spacing={2}>
                <Grid size={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ fontSize: 18, mr: 1 }} />
                      Full Name
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {staffInfo?.name || 'Not Available'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: 18, mr: 1 }} />
                      Email Address
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {getEmailUsername()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 18, mr: 1 }} />
                      Phone Number
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {staffInfo?.phone || 'Not Available'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Work sx={{ fontSize: 18, mr: 1 }} />
                      Job Position
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                      {staffInfo?.job || 'Not Available'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <LocationOn sx={{ mr: 1 }} />
                Location & System
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 18, mr: 1 }} />
                      Warehouse Address
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {staffLocation || 'Not Available'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={12}>
                  <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="body2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      #{staffInfo?._id || 'Not Available'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={12}>
                  <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                    <Typography variant="body2" color="text.secondary">
                      Account Status
                    </Typography>
                    <Chip 
                      label={staffInfo?.status ? "Active" : "Inactive"}
                      color={staffInfo?.status ? "success" : "error"}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>

                <Grid size={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Security sx={{ fontSize: 18, mr: 1 }} />
                      Session Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {userEmail || 'Not Available'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

Profile.defaultProps = {
  onEditInformation: () => {
    console.warn('onEditInformation function not provided');
  }
};

export default Profile;