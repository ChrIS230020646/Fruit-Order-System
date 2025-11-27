
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

      
      const response = await fetch(`${GetApi.api}/inventory/${inventoryData._id}`, {
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
            onClick={onBack}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Back to Inventory List
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
          update successful!
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
            Edit Inventory - {inventoryData.fruitName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            Update inventory quantity information
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
                  label="Fruit Name"
                  value={inventoryData.fruitName || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
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
                  label="Location ID"
                  value={inventoryData.locationId || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
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
                  label="Location Name"
                  value={inventoryData.locationName || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
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
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  helperText="Edit quantity only"
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
                  label="Inventory ID"
                  value={inventoryData._id}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Read only"
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

export default EditInventory;