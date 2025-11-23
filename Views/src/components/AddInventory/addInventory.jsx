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
  Select
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
          fetch(`${Getapi.api}/fruits/list`),
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

        console.log('Processed Fruits:', fruitsArray);
        console.log('Processed Locations:', locationsArray);

        setFruits(Array.isArray(fruitsArray) ? fruitsArray : []);
        setLocations(Array.isArray(locationsArray) ? locationsArray : []);
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

      const response = await fetch(`${Getapi.api}/inventory/insert/`, {
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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Inventory
      </Typography>
      
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
  );
};

export default SimpleAddInventory;