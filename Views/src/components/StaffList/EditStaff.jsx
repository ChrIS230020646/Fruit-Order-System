import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  MenuItem
} from '@mui/material';
import {
  Save
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';

const EditStaff = ({ staffData, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    job: '',
    locationId: '',
    status: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const jobPositions = [
    'manager',
    'staff',
    'shop'
  ];

  useEffect(() => {
    if (staffData) {
      setFormData({
        name: staffData.name || '',
        email: staffData.email || '',
        password: staffData.password || '',
        phone: staffData.phone || '',
        job: staffData.job || '',
        locationId: staffData.locationId || '',
        status: staffData.status !== undefined ? staffData.status : true
      });
    }
  }, [staffData]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(GetApi.api + '/staff/' + staffData._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
      
      setSuccess(true);
      
      if (onSave) {
        onSave({ ...staffData, ...formData });
      }
      
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!staffData) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            No Staff Selected
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please select a staff member to edit.
          </Typography>
          <Button 
            variant="contained" 
            onClick={onBack}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Back to Staff List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Staff updated successfully!
        </Alert>
      </Snackbar>

      <Paper sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)'
      }}>
        {/* Gradient Title Section */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
            Edit Staff - {staffData.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            Update staff member information
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 4 }}>
        <Card sx={{ 
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
              Staff Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  variant="outlined"
                  helperText="Enter new password to change"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Job Position"
                  value={formData.job}
                  onChange={handleInputChange('job')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  {jobPositions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location ID"
                  type="number"
                  value={formData.locationId}
                  onChange={handleInputChange('locationId')}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Staff ID"
                  value={staffData._id}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="This field cannot be edited"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '100%',
                  pt: { xs: 0, sm: 1 }
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.status}
                        onChange={handleSwitchChange('status')}
                        color="primary"
                      />
                    }
                    label={formData.status ? "Active" : "Inactive"}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined"
            onClick={onBack}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            CANCEL
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3d91 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            {loading ? 'Saving...' : 'SAVE CHANGES'}
          </Button>
        </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditStaff;