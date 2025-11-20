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
  Divider,
  Alert,
  Chip,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  Save,
  LocalGroceryStore,
  AttachMoney,
  Flag,
  Image
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';

const EditFruit = ({ fruitData, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    originCountryId: '',
    price: '',
    imageURL: ''
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
        price: fruitData.price || '',
        imageURL: fruitData.imageURL || ''
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


  const handleClearImage = () => {
    setFormData(prev => ({
      ...prev,
      imageURL: ''
    }));
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
        imageURL: formData.imageURL || '' // 直接傳遞，無論是什麼內容
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
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ borderRadius: 2 }}
          >
            Back to Fruit List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LocalGroceryStore sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Edit Fruit
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Update fruit information
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            Back to List
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalGroceryStore color="primary" />
              Fruit Information
            </Typography>
            
            <Grid container spacing={3}>
              
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
                />
              </Grid>

              
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
                />
              </Grid>

              
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
                />
              </Grid>

              
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
                />
              </Grid>

              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={formData.imageURL}
                    onChange={(e) => handleInputChange('imageURL', e.target.value)}
                    variant="outlined"
                    helperText="Optional: Enter any image URL or leave empty"
                    multiline
                    rows={2}
                    disabled={loading}
                    InputProps={{
                      startAdornment: <Image sx={{ color: 'text.secondary', mr: 1, mt: 2 }} />
                    }}
                  />
                  {formData.imageURL && (
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={handleClearImage}
                      disabled={loading}
                      sx={{ mt: 1 }}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Grid>

              
              {formData.imageURL && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Image Preview (if valid):
                    </Typography>
                    <img 
                      src={formData.imageURL} 
                      alt="Preview" 
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0'
                      }}
                      onError={(e) => {
                      
                        e.target.style.display = 'none';
                      }}
                    />
                    <Chip 
                      label="Image URL provided" 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                </Grid>
              )}

              
              {!formData.imageURL && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    p: 2, 
                    bgcolor: 'grey.50', 
                    borderRadius: 1 
                  }}>
                    <Image color="disabled" />
                    <Typography variant="body2" color="text.secondary">
                      No image URL provided. You can add any URL or leave empty.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        
        <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
          Fields marked with * are required. Image URL is optional and accepts any input.
        </Alert>

        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
          <Button 
            variant="outlined"
            onClick={onBack}
            sx={{ borderRadius: 2, px: 3 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            onClick={handleSave}
            sx={{ borderRadius: 2, px: 4 }}
            size="large"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>

      
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