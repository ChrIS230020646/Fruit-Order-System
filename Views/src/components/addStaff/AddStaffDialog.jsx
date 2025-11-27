import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Box,
  Typography,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Divider,
  Container,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import { Add, Delete, PersonAdd, Save } from '@mui/icons-material';
import Getapi from '../GetAPI/Getapi';

const AddStaffForm = ({ onStaffAdded }) => {
  
  const [staffMembers, setStaffMembers] = useState([
    { name: '', email: '', password: '', phone: '', job: '', locationId: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);
        const response = await fetch(`${Getapi.api}/locations`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Locations data:', result);
        
        if (result.data && Array.isArray(result.data)) {
          
          const processedLocations = result.data.map(location => ({
            id: location._id,
            address: location.address,
            type: location.type,
            cityId: location.cityId
          }));
          setLocationOptions(processedLocations);
        } else if (Array.isArray(result)) {
          const processedLocations = result.map(location => ({
            id: location._id,
            address: location.address,
            type: location.type,
            cityId: location.cityId
          }));
          setLocationOptions(processedLocations);
        }
        
      } catch (error) {
        console.error('Error fetching locations:', error);
        showSnackbar('Failed to load location data', 'error');
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  
  const jobOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'shop', label: 'Shop' },
    { value: 'staff', label: 'Staff' },
  ];

  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  
  const addStaffMember = () => {
    setStaffMembers(prev => [
      ...prev,
      { name: '', email: '', password: '', phone: '', job: '', locationId: '' }
    ]);
  };

  
  const removeStaffMember = (index) => {
    if (staffMembers.length > 1) {
      setStaffMembers(prev => prev.filter((_, i) => i !== index));
    }
  };

  
  const updateStaffMember = (index, field, value) => {
    setStaffMembers(prev => prev.map((staff, i) => 
      i === index ? { ...staff, [field]: value } : staff
    ));
    
    
    if (errors[`${index}-${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${index}-${field}`];
        return newErrors;
      });
    }
  };

  
  const validateForm = () => {
    const newErrors = {};

    staffMembers.forEach((staff, index) => {
      
      if (!staff.name.trim()) {
        newErrors[`${index}-name`] = 'Name is required';
      }

      
      if (!staff.email.trim()) {
        newErrors[`${index}-email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staff.email)) {
        newErrors[`${index}-email`] = 'Invalid email format';
      }

      
      if (!staff.password.trim()) {
        newErrors[`${index}-password`] = 'Password is required';
      } else if (staff.password.length < 6) {
        newErrors[`${index}-password`] = 'Password must be at least 6 characters';
      }

      
      if (!staff.job.trim()) {
        newErrors[`${index}-job`] = 'Please select a job position';
      }

      
      if (!staff.phone.trim()) {
        newErrors[`${index}-phone`] = 'Phone number is required';
      } else if (!/^\d{7,11}$/.test(staff.phone)) {
        newErrors[`${index}-phone`] = 'Please enter a valid phone number';
      }

      
      if (!staff.locationId) {
        newErrors[`${index}-locationId`] = 'Please select a location';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
const handleSubmit = async () => {
  if (!validateForm()) {
    showSnackbar('Please check for errors in the form', 'error');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${Getapi.api}/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        staffArray: staffMembers.map((staff, index) => ({
          _id: Date.now() + index, 
          ...staff,
          locationId: parseInt(staff.locationId),
          status: true 
        }))
      })
    });

    const result = await response.json();

    if (result.success) {
      showSnackbar(`Successfully added ${staffMembers.length} staff members`);
      setStaffMembers([{ name: '', email: '', password: '', phone: '', job: '', locationId: '' }]);
      setErrors({});
      if (onStaffAdded) {
        onStaffAdded();
      }
    } else {
      showSnackbar(result.error || 'Failed to add staff', 'error');
    }
  } catch (error) {
    console.error('Failed to add staff:', error);
    showSnackbar('Network error, please try again later', 'error');
  } finally {
    setLoading(false);
  }
};

  
  const handleReset = () => {
    setStaffMembers([{ name: '', email: '', password: '', phone: '', job: '', locationId: '' }]);
    setErrors({});
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
      <Paper sx={{ 
        p: 0,
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <Box sx={{ 
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <PersonAdd sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                  Add Staff
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                  Add staff information in bulk, support adding multiple staff members at once
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip 
                label={`${staffMembers.length} staff`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
              <Chip 
                label={`${locationOptions.length} locations`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      
      <Paper sx={{ 
        p: 3,
        borderRadius: 3,
        boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Staff Information
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={addStaffMember}
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: 2,
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
                color: 'white',
              },
            }}
          >
            + ADD STAFF FORM
          </Button>
        </Box>

        {staffMembers.map((staff, index) => (
          <Card key={index} sx={{ 
            mb: 3, 
            border: '1px solid', 
            borderColor: (theme) => theme.palette.divider, 
            borderRadius: 3,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="primary">
                  Staff #{index + 1}
                </Typography>
                {staffMembers.length > 1 && (
                  <IconButton 
                    onClick={() => removeStaffMember(index)}
                    color="error"
                    size="small"
                    title="Remove this staff"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={3}>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={staff.name}
                    onChange={(e) => updateStaffMember(index, 'name', e.target.value)}
                    error={!!errors[`${index}-name`]}
                    helperText={errors[`${index}-name`]}
                    required
                    placeholder="Enter staff name"
                  />
                </Grid>

                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={staff.email}
                    onChange={(e) => updateStaffMember(index, 'email', e.target.value)}
                    error={!!errors[`${index}-email`]}
                    helperText={errors[`${index}-email`]}
                    required
                    placeholder="example@company.com"
                  />
                </Grid>

                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={staff.password}
                    onChange={(e) => updateStaffMember(index, 'password', e.target.value)}
                    error={!!errors[`${index}-password`]}
                    helperText={errors[`${index}-password`] || 'At least 6 characters'}
                    required
                    placeholder="Set login password"
                  />
                </Grid>

                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={staff.phone}
                    onChange={(e) => updateStaffMember(index, 'phone', e.target.value)}
                    error={!!errors[`${index}-phone`]}
                    helperText={errors[`${index}-phone`]}
                    required
                    placeholder="Enter 11-digit phone number"
                  />
                </Grid>

                
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors[`${index}-job`]}>
                        <InputLabel id={`staff-job-label-${index}`} shrink>
                          Job Position
                        </InputLabel>
                        <Select
                          labelId={`staff-job-label-${index}`}
                          id={`staff-job-select-${index}`}
                          value={staff.job}
                          label="Job Position"
                          onChange={(e) => updateStaffMember(index, 'job', e.target.value)}
                          required
                          displayEmpty
                          notched
                        >
                          <MenuItem value="" disabled>
                            <em>Select a job position</em>
                          </MenuItem>
                          {jobOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[`${index}-job`] && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors[`${index}-job`]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors[`${index}-locationId`]}>
                        <InputLabel id={`staff-location-label-${index}`} shrink>
                          {locationsLoading ? 'Loading locations...' : 'Work Location'}
                        </InputLabel>
                        <Select
                          labelId={`staff-location-label-${index}`}
                          id={`staff-location-select-${index}`}
                          value={staff.locationId}
                          label={locationsLoading ? 'Loading locations...' : 'Work Location'}
                          onChange={(e) => updateStaffMember(index, 'locationId', e.target.value)}
                          required
                          disabled={locationsLoading}
                          displayEmpty
                          notched
                          endAdornment={locationsLoading ? <CircularProgress size={20} /> : null}
                        >
                          <MenuItem value="" disabled>
                            <em>Select a work location</em>
                          </MenuItem>
                          {locationOptions.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                              <Box>
                                <Typography variant="body1" color="text.primary">
                                  {location.address}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {location.id} • Type: {location.type}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[`${index}-locationId`] && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors[`${index}-locationId`]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        
        <Box display="flex" justifyContent="flex-end" gap={2} mt={4} pt={3} borderTop={1} borderColor="divider">
          <Button 
            onClick={handleReset}
            variant="outlined"
            disabled={loading}
            size="large"
            sx={{
              borderRadius: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
                color: 'white',
              },
            }}
          >
            RESET FORM
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || locationsLoading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            size="large"
            sx={{ 
              minWidth: 120,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              },
            }}
          >
            {loading ? 'Submitting...' : `SUBMIT (${staffMembers.length})`}
          </Button>
        </Box>
      </Paper>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddStaffForm;