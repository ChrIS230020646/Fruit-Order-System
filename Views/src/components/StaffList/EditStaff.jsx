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
  ArrowBack,
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
    'admin',
    'supervisor',
    'assistant'
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
      
      const response = await fetch(GetApi.api + '/staff/update/' + staffData._id, {
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
            startIcon={<ArrowBack />}
            onClick={onBack}
          >
            Back to Staff List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Edit Staff - {staffData.name}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={onBack}
          >
            Back
          </Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  variant="outlined"
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
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Staff ID"
                  value={staffData._id}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="This field cannot be edited"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined"
            onClick={onBack}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditStaff;