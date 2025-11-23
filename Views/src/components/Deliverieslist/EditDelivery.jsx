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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Save
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';

const EditDelivery = ({ deliveryData, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (deliveryData) {
      setFormData({
        quantity: deliveryData.quantity || '',
        status: deliveryData.status || ''
      });
    }
  }, [deliveryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.quantity || !formData.status) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.quantity <= 0) {
        setError('Quantity must be greater than 0');
        setLoading(false);
        return;
      }

      // Prepare submit data
      const submitData = {
        quantity: parseInt(formData.quantity),
        status: formData.status
      };

      // Update delivery
      const response = await fetch(`${GetApi.api}/deliveries/update/${deliveryData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        if (onSave) {
          onSave(result.data);
        }
        // Auto navigate back after success
        setTimeout(() => {
          if (onBack) {
            onBack();
          }
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to update delivery');
      }

    } catch (err) {
      console.error('Error updating delivery:', err);
      setError(err.message || 'Failed to update delivery');
    } finally {
      setLoading(false);
    }
  };

  if (!deliveryData) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" color="error" gutterBottom>
            No Delivery Selected
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please select a delivery to edit from the list.
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
            Back to Deliveries List
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
          Delivery updated successfully!
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
            Edit Delivery - {deliveryData._id || 'New Delivery'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            Update delivery information
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Card sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                Delivery Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Fruit Name"
                    value={deliveryData.fruitName || 'Unknown'}
                    InputProps={{ readOnly: true }}
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
                    label="From Warehouse"
                    value={deliveryData.fromWarehouseId || ''}
                    InputProps={{ readOnly: true }}
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
                    label="To Location"
                    value={deliveryData.toLocationId || ''}
                    InputProps={{ readOnly: true }}
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
                    label="Delivery Date"
                    value={deliveryData.deliveryDate ? new Date(deliveryData.deliveryDate).toLocaleDateString() : ''}
                    InputProps={{ readOnly: true }}
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
                    label="Estimated Arrival"
                    value={deliveryData.estimatedArrivalDate ? new Date(deliveryData.estimatedArrivalDate).toLocaleDateString() : ''}
                    InputProps={{ readOnly: true }}
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
                    required
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    inputProps={{ min: 1 }}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required disabled={loading}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      label="Status"
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
    </Box>
  );
};

export default EditDelivery;

