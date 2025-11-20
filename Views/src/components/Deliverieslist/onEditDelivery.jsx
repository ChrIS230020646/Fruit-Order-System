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
  CircularProgress
} from '@mui/material';
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
    >
      <DialogTitle>
        Edit Delivery - {delivery?._id || 'New Delivery'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From Warehouse"
                value={delivery?.fromWarehouseId || ''}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="To Location"
                value={delivery?.toLocationId || ''}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Delivery Date"
                value={delivery?.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : ''}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Arrival"
                value={delivery?.estimatedArrivalDate ? new Date(delivery.estimatedArrivalDate).toLocaleDateString() : ''}
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
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
                margin="normal"
              />
            </Grid>

            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
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

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={saving}
            startIcon={saving && <CircularProgress size={16} />}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OnEditDelivery;