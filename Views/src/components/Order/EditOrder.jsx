
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
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  Save
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';

const EditInventory = ({ inventoryData, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    quantity: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  
  useEffect(() => {
    if (inventoryData) {
      setFormData({
        quantity: inventoryData.quantity || 0
      });
    }
  }, [inventoryData]);

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      quantity: Number(value)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      
      const updateData = {
        quantity: formData.quantity
      };

      console.log('Updating inventory:', {
        inventoryId: inventoryData._id,
        updateData: updateData
      });

      
      const response = await fetch(`${GetApi.api}/inventory/update/${inventoryData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
      
      setSuccess(true);
      
      
      if (onSave) {
        onSave({ ...inventoryData, quantity: formData.quantity });
      }
      
    } catch (error) {
      console.error('Update error:', error);
      alert('update error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  
  if (!inventoryData) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            No Inventory Selected
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please select an inventory item to edit.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />}
            onClick={onBack}
          >
            Back to Inventory List
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
          update successful!
        </Alert>
      </Snackbar>

      <Paper sx={{ p: 3 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Edit Inventory - {inventoryData.fruitName}
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
              Inventory Information
            </Typography>
            <Grid container spacing={3}>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fruit ID"
                  value={inventoryData.fruitId || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fruit Name"
                  value={inventoryData.fruitName || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location ID"
                  value={inventoryData.locationId || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location Name"
                  value={inventoryData.locationName || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
                />
              </Grid>
              
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  helperText="Edit quantity only"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Inventory ID"
                  value={inventoryData._id}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
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

export default EditInventory;