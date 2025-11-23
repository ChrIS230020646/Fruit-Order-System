import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Box,
  Alert,
  CircularProgress,
  Button,
  Typography
} from '@mui/material';
import GetApi from '../GetAPI/Getapi';
import AuthService from '../../utils/auth';

const AddDeliveries = () => {
  const [formData, setFormData] = useState({
    fromWarehouseId: '',
    toLocationId: '',
    fruitId: '',
    quantity: '',
    deliveryDate: '',
    estimatedArrivalDate: '',
    status: 'Pending'
  });
  const [fruits, setFruits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [staffLocationId, setStaffLocationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchRelatedData();
  }, []);

  const fetchRelatedData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('loading...');
      
      
      const authStatus = await AuthService.checkAuthStatus();
      const userJson = await fetch(`${GetApi.api}/staff/information/${authStatus.email}`, {
        credentials: 'include'
      });
          
      if (!userJson.ok) {
        throw new Error(`HTTP error! status: ${userJson.status}`);
      }
          
      const userget = await userJson.json();
      console.log('Staff information:', userget);
      
      
      if (userget.staff && userget.staff.locationId) {
        const locationId = userget.staff.locationId.toString(); 
        setStaffLocationId(locationId);
        
        setFormData(prev => ({
          ...prev,
          fromWarehouseId: locationId
        }));
        console.log('Set staff location ID:', locationId);
      } else {
        console.warn('No location ID found in staff data');
      }

      
      const [fruitsRes, locationsRes] = await Promise.all([
        fetch(`${GetApi.api}/fruits`),
        fetch(`${GetApi.api}/locations`)
      ]);

      console.log('Fruits response:', fruitsRes);
      console.log('Locations response:', locationsRes);

      const fruitsData = await fruitsRes.json();
      const locationsData = await locationsRes.json();

      console.log('Fruits data:', fruitsData);
      console.log('Locations data:', locationsData);

      
      if (fruitsData && fruitsData.data) {
        const processedFruits = fruitsData.data.map(item => {
          if (item && typeof item === 'object') {
            if (item._doc) {
              return {
                _id: item._doc._id,
                name: item._doc.name,
                originCountryId: item._doc.originCountryId,
                price: item._doc.price,
                imageURL: item._doc.imageURL
              };
            }
            
            return {
              _id: item._id,
              name: item.name,
              originCountryId: item.originCountryId,
              price: item.price,
              imageURL: item.imageURL
            };
          }
          return item;
        });
        console.log('Processed fruits:', processedFruits);
        setFruits(processedFruits);
      } else {
        console.warn('No fruits data found');
        setFruits([]);
      }

      
      if (locationsData && locationsData.data) {
        console.log('Locations data found:', locationsData.data);
        setLocations(locationsData.data);
      } else {
        console.warn('No locations data found');
        setLocations([]);
      }

    } catch (err) {
      console.error('Error fetching related data:', err);
      setError('Failed to load related data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const getFilteredLocations = () => {
    if (!staffLocationId) return locations;
    
    return locations.filter(location => 
      location._id !== staffLocationId
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    
    if (name === 'fromWarehouseId') {
      return; 
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'deliveryDate' && value) {
      const deliveryDate = new Date(value);
      const estimatedArrivalDate = new Date(deliveryDate);
      estimatedArrivalDate.setDate(estimatedArrivalDate.getDate() + 2);
      
      setFormData(prev => ({
        ...prev,
        estimatedArrivalDate: estimatedArrivalDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      
      if (!formData.fromWarehouseId || !formData.toLocationId || !formData.fruitId || 
          !formData.quantity || !formData.deliveryDate || !formData.estimatedArrivalDate) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.fromWarehouseId === formData.toLocationId) {
        setError('From and To locations cannot be the same');
        return;
      }

      if (formData.quantity <= 0) {
        setError('Quantity must be greater than 0');
        return;
      }

      const deliveryDate = new Date(formData.deliveryDate);
      const estimatedArrivalDate = new Date(formData.estimatedArrivalDate);

      if (estimatedArrivalDate < deliveryDate) {
        setError('Estimated arrival date cannot be before delivery date');
        return;
      }

      const customId = parseInt(`${formData.fromWarehouseId}${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-15));

      
      const submitData = {
        _id: customId,
        fromWarehouseId: formData.fromWarehouseId,
        toLocationId: formData.toLocationId,
        fruitId: formData.fruitId,
        quantity: parseInt(formData.quantity),
        deliveryDate: deliveryDate.toISOString(),
        estimatedArrivalDate: estimatedArrivalDate.toISOString(),
        status: formData.status
      };

      console.log('Submitting data:', submitData);

      const response = await fetch(`${GetApi.api}/deliveries/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      console.log('API response:', result);

      if (response.ok && result.success) {
        setSuccess('Delivery created successfully!');
        
        
        setFormData({
          fromWarehouseId: staffLocationId || '',
          toLocationId: '',
          fruitId: '',
          quantity: '',
          deliveryDate: '',
          estimatedArrivalDate: '',
          status: 'Pending'
        });
      } else {
        throw new Error(result.message || 'Failed to create delivery');
      }

    } catch (err) {
      console.error('Error creating delivery:', err);
      setError(err.message || 'Failed to create delivery');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fromWarehouseId: staffLocationId || '',
      toLocationId: '',
      fruitId: '',
      quantity: '',
      deliveryDate: '',
      estimatedArrivalDate: '',
      status: 'Pending'
    });
    setError('');
    setSuccess('');
  };

  const getLocationDisplayName = (location) => {
    if (!location) return 'Unknown';
    if (location.address) return location.address;
    if (location.cityId) return `City ${location.cityId}`;
    return `Location ${location._id}`;
  };

  const getFruitDisplayName = (fruit) => {
    if (!fruit) return 'Unknown';
    return fruit.name || `Fruit ${fruit._id}`;
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  
  const getStaffLocation = () => {
    if (!staffLocationId) return null;
    return locations.find(location => location._id === staffLocationId);
  };

  
  const filteredLocations = getFilteredLocations();
  const staffLocation = getStaffLocation();

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography sx={{ ml: 2 }} color="text.primary">Loading data...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ 
        p: 0,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <Box sx={{ 
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
            Add New Delivery
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            Create a new delivery record
          </Typography>
        </Box>
        <Box sx={{ p: 4 }}>

        {(error || success) && (
          <Alert 
            severity={error ? 'error' : 'success'} 
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error || success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>From Warehouse</InputLabel>
                <Select
                  name="fromWarehouseId"
                  value={formData.fromWarehouseId}
                  onChange={handleInputChange}
                  label="From Warehouse"
                  disabled 
                >
                  {staffLocationId && staffLocation ? (
                    <MenuItem value={staffLocationId}>
                      {getLocationDisplayName(staffLocation)} (Your Location)
                    </MenuItem>
                  ) : (
                    <MenuItem value={formData.fromWarehouseId}>
                      {formData.fromWarehouseId ? `Location ${formData.fromWarehouseId}` : 'No location set'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                This field is automatically set to your assigned location
              </Typography>
            </Grid>

            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel shrink>To Location</InputLabel>
                <Select
                  name="toLocationId"
                  value={formData.toLocationId}
                  onChange={handleInputChange}
                  label="To Location"
                  displayEmpty
                  notched
                >
                  <MenuItem value="" disabled>
                    <em>Select a location</em>
                  </MenuItem>
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <MenuItem key={location._id} value={location._id}>
                        {getLocationDisplayName(location)}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No locations available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel shrink>Fruit</InputLabel>
                <Select
                  name="fruitId"
                  value={formData.fruitId}
                  onChange={handleInputChange}
                  label="Fruit"
                  displayEmpty
                  notched
                >
                  <MenuItem value="" disabled>
                    <em>Select a fruit</em>
                  </MenuItem>
                  {fruits.length > 0 ? (
                    fruits.map((fruit) => (
                      <MenuItem key={fruit._id} value={fruit._id}>
                        {getFruitDisplayName(fruit)}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No fruits available</MenuItem>
                  )}
                </Select>
              </FormControl>
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
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Delivery Date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 
                  min: getTodayDate()
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Estimated Arrival Date"
                name="estimatedArrivalDate"
                value={formData.estimatedArrivalDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 
                  min: formData.deliveryDate || getTodayDate()
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
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

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleReset}
                  disabled={saving}
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
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={saving}
                  startIcon={saving && <CircularProgress size={16} />}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    },
                  }}
                >
                  {saving ? 'Creating...' : 'Create Delivery'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddDeliveries;