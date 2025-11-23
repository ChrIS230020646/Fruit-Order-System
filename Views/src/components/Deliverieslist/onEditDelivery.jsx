import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import {
  Save
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';

const OnEditDelivery = ({ 
  open, 
  onClose, 
  delivery, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    quantity: '',
    status: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  
  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  
  useEffect(() => {
    if (delivery) {
      setFormData({
        quantity: delivery.quantity || '',
        status: delivery.status || ''
      });
    }
  }, [delivery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      
      if (!formData.quantity || !formData.status) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.quantity <= 0) {
        setError('Quantity must be greater than 0');
        return;
      }

      
      const submitData = {
        quantity: parseInt(formData.quantity),
        status: formData.status
      };

      
      const response = await fetch(`${GetApi.api}/deliveries/update/${delivery._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSave(result.data); 
        onClose();
      } else {
        throw new Error(result.message || 'Failed to update delivery');
      }

    } catch (err) {
      console.error('Error updating delivery:', err);
      setError(err.message || 'Failed to update delivery');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      quantity: '',
      status: ''
    });
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)'
        }
      }}
    >
      {/* Gradient Title Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Edit Delivery - {delivery?._id || 'New Delivery'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Update delivery information
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          
          <Grid container spacing={2}>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fruit Name"
                value={delivery?.fruitName || 'Unknown'}
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
                value={delivery?.fromWarehouseId || ''}
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
                value={delivery?.toLocationId || ''}
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
                value={delivery?.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : ''}
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
                value={delivery?.estimatedArrivalDate ? new Date(delivery.estimatedArrivalDate).toLocaleDateString() : ''}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
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
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={saving}
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
            type="submit" 
            variant="contained" 
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
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
            {saving ? 'Saving...' : 'SAVE CHANGES'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OnEditDelivery;