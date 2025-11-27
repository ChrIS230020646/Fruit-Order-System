import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Grid,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Getapi from '../GetAPI/Getapi';

const SimpleAddInventory = () => {
  const [inventoryData, setInventoryData] = useState({
    fruitId: '',
    locationId: '',
    quantity: ''
  });
  const [fruits, setFruits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fruitsRes, locationsRes] = await Promise.all([
          fetch(`${Getapi.api}/fruits`),
          fetch(`${Getapi.api}/locations`)
        ]);

        if (!fruitsRes.ok || !locationsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const fruitsData = await fruitsRes.json();
        const locationsData = await locationsRes.json();

        console.log('Fruits API Response:', fruitsData);
        console.log('Locations API Response:', locationsData);

        
        
        const fruitsArray = fruitsData.data || fruitsData;
        const locationsArray = locationsData.data || locationsData;

        
        const processedFruits = Array.isArray(fruitsArray) ? fruitsArray.map(fruit => {
            
            if (fruit._doc) {
                return fruit._doc;
            }
            
            return {
                _id: fruit._id || fruit.id,
                name: fruit.name || 'Unknown Fruit',
                originCountryId: fruit.originCountryId,
                price: fruit.price,
                unit: fruit.unit,
                description: fruit.description,
                imageURL: fruit.imageURL,
                originCountryName: fruit.originCountryName
            };
        }) : [];

        const processedLocations = Array.isArray(locationsArray) ? locationsArray.map(location => {
            
            if (location._doc) {
                return location._doc;
            }
            
            return {
                _id: location._id || location.id,
                address: location.address || 'Unknown Address',
                type: location.type || 'Unknown Type'
            };
        }) : [];

        console.log('Processed Fruits:', processedFruits);
        console.log('Processed Locations:', processedLocations);

        setFruits(processedFruits);
        setLocations(processedLocations);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: `Error fetching data: ${error.message}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const getFruitDisplayInfo = (fruit) => {
    const fruitId = fruit._id;
    const fruitName = fruit.name || 'Unknown Fruit';
    return `ID: ${fruitId} - ${fruitName}`;
  };

  
  const getLocationDisplayInfo = (location) => {
    const locationId = location._id;
    return `ID: ${locationId} - ${location.address} (${location.type})`;
  };

  const handleInputChange = (field, value) => {
    setInventoryData({
      ...inventoryData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    
    if (!inventoryData.fruitId || !inventoryData.locationId || !inventoryData.quantity) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }

    if (parseInt(inventoryData.quantity) <= 0) {
      setSnackbar({
        open: true,
        message: 'Quantity must be greater than 0',
        severity: 'error'
      });
      return;
    }

    try {
      const inventoryArray = [{
        _id: Date.now(),
        fruitId: parseInt(inventoryData.fruitId),
        locationId: parseInt(inventoryData.locationId),
        quantity: parseInt(inventoryData.quantity)
      }];

      console.log('Submitting inventory:', inventoryArray);

      const response = await fetch(`${Getapi.api}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryArray
        }),
      });

      const result = await response.json();
      console.log('Submit response:', result);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Inventory added successfully!',
          severity: 'success'
        });
        
        setInventoryData({
          fruitId: '',
          locationId: '',
          quantity: ''
        });
      } else {
        setSnackbar({
          open: true,
          message: `Failed to add: ${result.error || 'Unknown error'}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSnackbar({
        open: true,
        message: `Error occurred: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
    <Paper sx={{ 
      width: '100%', 
      maxWidth: '100%',
      overflow: 'hidden',
      borderRadius: 3,
      boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
          Add Inventory
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
          Add new inventory items to the system
        </Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id={`staff-fruit-label-${fruits}`} shrink>
               Fruit ID*
            </InputLabel>
            <Select
              value={inventoryData.fruitId}
              label="Fruit ID"
              onChange={(e) => handleInputChange('fruitId', e.target.value)}
              disabled={loading || fruits.length === 0}
              required
              displayEmpty
              notched
            >
            <MenuItem value="" disabled>
                <em>Select Fruit</em>
              </MenuItem>
              {fruits.length === 0 ? (
                <MenuItem disabled>
                  {loading ? 'Loading fruits...' : 'No fruits available'}
                </MenuItem>
              ) : (
                fruits.map((fruit) => (
                  <MenuItem key={fruit._id} value={fruit._id}>
                    {getFruitDisplayInfo(fruit)}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id={`staff-location-label-${fruits}`} shrink>
               Location Id *
            </InputLabel>
            <Select
              value={inventoryData.locationId}
              label="Location ID"
              onChange={(e) => handleInputChange('locationId', e.target.value)}
              disabled={loading || locations.length === 0}
              required
              displayEmpty
              notched
            >
             <MenuItem value="" disabled>
                <em>Select Location</em>
              </MenuItem>
              {locations.length === 0 ? (
                <MenuItem disabled>
                  {loading ? 'Loading locations...' : 'No locations available'}
                </MenuItem>
              ) : (
                locations.map((location) => (
                  <MenuItem key={location._id} value={location._id}>
                    {getLocationDisplayInfo(location)}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={inventoryData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            inputProps={{ min: 1 }}
            error={inventoryData.quantity && parseInt(inventoryData.quantity) <= 0}
            helperText={inventoryData.quantity && parseInt(inventoryData.quantity) <= 0 ? 'Quantity must be greater than 0' : ''}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleSubmit}
            disabled={loading || !inventoryData.fruitId || !inventoryData.locationId || !inventoryData.quantity || parseInt(inventoryData.quantity) <= 0}
          >
            {loading ? 'Loading...' : 'Add Inventory'}
          </Button>
        </Grid>
      </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
    </Box>
  );
};

export default SimpleAddInventory;