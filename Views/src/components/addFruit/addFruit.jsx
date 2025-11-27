import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Add, Clear } from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';

const AddFruit = () => {
  const [fruits, setFruits] = useState([{ 
    name: '', 
    originCountryId: '', 
    price: ''
  }]);
  const [countries, setCountries] = useState([]);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [loading, setLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch(`${GetApi.api}/countries`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Countries API response:', data);

        let countriesList = [];
        if (data.data && Array.isArray(data.data)) {
          countriesList = data.data;
        } else if (Array.isArray(data)) {
          countriesList = data;
        }
        
        console.log('Parsed countries list:', countriesList);
        setCountries(countriesList);
        
        if (countriesList.length === 0) {
          console.warn('No countries found in database');
          setNotification({
            open: true,
            message: 'No countries available. Please add countries to the database first.',
            severity: 'warning'
          });
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        setNotification({
          open: true,
          message: `Failed to load countries data: ${error.message}`,
          severity: 'error'
        });
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const addFruitRow = () => {
    setFruits([...fruits, { 
      name: '', 
      originCountryId: '', 
      price: ''
    }]);
  };

  const removeFruitRow = (index) => {
    if (fruits.length > 1) {
      const newFruits = fruits.filter((_, i) => i !== index);
      setFruits(newFruits);
    }
  };

  const updateFruit = (index, field, value) => {
    const newFruits = fruits.map((fruit, i) => 
      i === index ? { ...fruit, [field]: value } : fruit
    );
    setFruits(newFruits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validFruits = fruits.filter(fruit => 
        fruit.name.trim() && fruit.originCountryId && fruit.price
      );

      if (validFruits.length === 0) {
        setNotification({
          open: true,
          message: 'Please fill at least one complete fruit information',
          severity: 'warning'
        });
        setLoading(false);
        return;
      }

      const fruitsWithIds = validFruits.map((fruit, index) => ({
        _id: fruit._id || Date.now() + index,
        name: fruit.name.trim(),
        originCountryId: parseInt(fruit.originCountryId) || 0,
        price: parseFloat(fruit.price) || 0,
        imageURL: null 
      }));

      const response = await fetch(`${GetApi.api}/fruits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fruitsArray: fruitsWithIds
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNotification({
          open: true,
          message: result.notification?.message || 'Fruits added successfully!',
          severity: 'success'
        });
        
        setFruits([{ 
          name: '', 
          originCountryId: '', 
          price: ''
        }]);
      } else {
        setNotification({
          open: true,
          message: result.notification?.message || result.error || 'Failed to add fruits',
          severity: 'error'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Network error, please check your connection',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFruits([{ 
      name: '', 
      originCountryId: '', 
      price: ''
    }]);
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
            Add Fruits
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            Batch add fruit information to database
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {fruits.map((fruit, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                      Fruit #{index + 1}
                      {fruits.length > 1 && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Clear />}
                          onClick={() => removeFruitRow(index)}
                          sx={{ ml: 2 }}
                        >
                          Remove
                        </Button>
                      )}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          label="Fruit Name *"
                          value={fruit.name}
                          onChange={(e) => updateFruit(index, 'name', e.target.value)}
                          required
                          placeholder="e.g., Apple"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                          <InputLabel id={`country-label-${index}`} shrink>
                            Origin Country *
                          </InputLabel>
                          <Select
                            label="Origin Country *"
                            value={fruit.originCountryId}
                            onChange={(e) => updateFruit(index, 'originCountryId', e.target.value)}
                            required
                            displayEmpty
                            notched
                            disabled={countriesLoading}
                          >
                            <MenuItem value="" disabled>
                              <em>Select Origin Country</em>
                            </MenuItem>
                            {countries.map((country) => (
                              <MenuItem key={country._id} value={country._id}>
                                {country.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          label="Price *"
                          type="number"
                          value={fruit.price}
                          onChange={(e) => updateFruit(index, 'price', e.target.value)}
                          required
                          placeholder="e.g., 1.20"
                          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                type="button"
                variant="outlined"
                startIcon={<Add />}
                onClick={addFruitRow}
              >
                Add More Fruits
              </Button>
              
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleClear}
              >
                Clear Form
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading || countriesLoading}
                sx={{ ml: 'auto', minWidth: 120 }}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Submitting...' : 'Submit All Fruits'}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddFruit;