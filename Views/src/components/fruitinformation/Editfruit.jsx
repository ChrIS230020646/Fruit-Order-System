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
  Avatar,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Save,
  LocalGroceryStore,
  AttachMoney,
  Flag
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';

const EditFruit = ({ fruitData, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    originCountryId: '',
    price: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (fruitData) {
      setFormData({
        _id: fruitData._id || '',
        name: fruitData.name || '',
        originCountryId: fruitData.originCountryId || '',
        price: fruitData.price || ''
      });
    }
  }, [fruitData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Fruit name is required';
    }

    if (!formData.originCountryId || formData.originCountryId < 1) {
      newErrors.originCountryId = 'Valid country ID is required';
    }

    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const api = GetApi.api + `/fruits/update/${formData._id}`;
      
      const updateData = {
        name: formData.name,
        originCountryId: parseInt(formData.originCountryId),
        price: parseFloat(formData.price),
        imageURL: null // 直接設定為 null
      };

      const response = await fetch(api, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Fruit updated successfully!',
          severity: 'success'
        });
        
        if (onSave) {
          onSave({
            ...formData,
            price: parseFloat(formData.price),
            originCountryId: parseInt(formData.originCountryId)
          });
        }
      } else {
        throw new Error(result.message || result.error || 'Failed to update fruit');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update fruit',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!fruitData) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" color="error" gutterBottom>
            No Fruit Selected
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Please select a fruit to edit from the list.
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
            Back to Fruit List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)'
      }}>
        {/* Gradient Title Section */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
            <LocalGroceryStore sx={{ fontSize: 30, color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
              Edit Fruit
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
              Update fruit information
            </Typography>
          </Box>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 4 }}>
          <Card sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontWeight: 600,
                mb: 3,
                color: 'text.primary'
              }}>
                <LocalGroceryStore color="primary" />
                Fruit Information
              </Typography>
              
              <Grid container spacing={3}>
                {/* Fruit ID */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Fruit ID"
                    value={formData._id}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="Unique identifier"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                {/* Fruit Name */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Fruit Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name || "e.g., Apple, Banana"}
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                {/* Country ID */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Country ID *"
                    type="number"
                    value={formData.originCountryId}
                    onChange={(e) => handleInputChange('originCountryId', e.target.value)}
                    variant="outlined"
                    error={!!errors.originCountryId}
                    helperText={errors.originCountryId || "Country identifier"}
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: <Flag sx={{ color: 'text.secondary', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Price *"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    variant="outlined"
                    error={!!errors.price}
                    helperText={errors.price || "Price in USD"}
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />,
                      inputProps: { step: "0.01", min: "0" }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            Fields marked with * are required.
          </Alert>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
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
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditFruit;