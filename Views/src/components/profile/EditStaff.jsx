
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  Paper,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  Save,
  Cancel
} from '@mui/icons-material';
import AuthService from '../../utils/auth';
import GetApi from '../GetAPI/Getapi';

const EditStaff = ({ onCancel, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);

  
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    phone: '',
    password: '',
    
    email: '',
    job: '',
    location: '',
    locationId: '',
    status: true
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        
        const authStatus = await AuthService.checkAuthStatus();
        console.log('Auth status:', authStatus);
        
        if (authStatus.success && authStatus.isLoggedIn) {
          
          
          const userJson = await fetch(`${GetApi.api}/staff/information/${authStatus.email}`, {
            credentials: 'include'
          });
          
          if (!userJson.ok) {
            throw new Error(`HTTP error! status: ${userJson.status}`);
          }
          
          const userget = await userJson.json();
          console.log('Staff data:', userget);
          
          
          
          setFormData({
            _id: userget.staff?._id || '',
            name: userget.staff?.name || '',
            email: userget.staff?.email || authStatus.email,
            phone: userget.staff?.phone || '',
            job: userget.staff?.job || '',
            location: userget.staff?.location || userget.location || '',
            locationId: userget.staff?.locationId || '',
            status: userget.staff?.status || true,
            password: '' 
          });
        } else {
          throw new Error('User not logged in');
        }
      } catch (error) {
        console.error('Failed to fetch staff information:', error);
        setAlert({
          open: true,
          message: 'Failed to load staff information',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      
      if (!formData.name || !formData.phone) {
        setAlert({
          open: true,
          message: 'Please fill in all required fields (Name, Phone)',
          severity: 'error'
        });
        setSaving(false);
        return;
      }

      
      const updateData = {
        name: formData.name,
        phone: formData.phone
      };

      
      if (formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      console.log('Updating staff with data:', updateData);

      
      const response = await fetch(`${GetApi.api}/staff/update/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (response.ok) {
        setAlert({
          open: true,
          message: formData.password ? 
            'Staff information and password updated successfully!' : 
            'Staff information updated successfully!',
          severity: 'success'
        });
        
        
        setTimeout(() => {
          if (onSave) {
            onSave(formData);
          }
        }, 1000);
      } else {
        throw new Error(result.message || result.error || 'Failed to update staff information');
      }
    } catch (error) {
      console.error('Update error:', error);
      setAlert({
        open: true,
        message: error.message || 'Failed to update staff information',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" color="primary">
          Edit Staff Information
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Person sx={{ mr: 1 }} />
            Personal Details
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ fontSize: 18, mr: 1 }} />
                  Full Name *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="Enter full name"
                  size="small"
                />
              </Paper>
            </Grid>

            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  placeholder="Email address"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Email cannot be changed
                </Typography>
              </Paper>
            </Grid>

            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ fontSize: 18, mr: 1 }} />
                  Phone Number *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="Enter phone number"
                  size="small"
                />
              </Paper>
            </Grid>

            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Lock sx={{ fontSize: 18, mr: 1 }} />
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Enter new password (leave blank to keep current)"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Leave blank if you don't want to change password
                </Typography>
              </Paper>
            </Grid>

            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Job Position
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.job}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Paper>
            </Grid>

            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Location
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.location}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<Cancel />}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

EditStaff.defaultProps = {
  onCancel: () => console.warn('onCancel function not provided'),
  onSave: () => console.warn('onSave function not provided')
};

export default EditStaff;