import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Alert,
  Avatar,
  Chip,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Send,
  SwapHoriz,
  Store,
  LocalGroceryStore,
  Numbers,
  Event,
  CheckCircle
} from '@mui/icons-material';
import GetApi from '../GetAPI/Getapi';
import AuthService from '../../utils/auth';

const RequestBorrow = () => {
  const [formData, setFormData] = useState({
    fromShopId: '',
    toShopId: '',
    fruitId: '',
    quantity: '',
    borrowDate: '',
    returnDate: ''
  });

  const [staffInfo, setStaffInfo] = useState(null);
  const [shopOptions, setShopOptions] = useState([]);
  const [fruitOptions, setFruitOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [shopMatchError, setShopMatchError] = useState('');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        
        const [fruitsRes, locationsRes] = await Promise.all([
          fetch(`${GetApi.api}/fruits`),
          fetch(`${GetApi.api}/locations`)
        ]);

        if (!fruitsRes.ok) {
          throw new Error(`Failed to fetch fruits: ${fruitsRes.status}`);
        }
        if (!locationsRes.ok) {
          throw new Error(`Failed to fetch locations: ${locationsRes.status}`);
        }

        const fruitsData = await fruitsRes.json();
        const locationsData = await locationsRes.json();

        console.log('Fruits data:', fruitsData);
        console.log('Locations data:', locationsData);

        
        const processFruitData = (fruit) => {
          console.log('Processing fruit:', fruit);
          
          if (fruit._doc) {
            const processed = {
              id: fruit._doc._id?.toString(),
              name: fruit._doc.name,
              price: fruit._doc.price,
              originCountryId: fruit._doc.originCountryId,
              imageURL: fruit._doc.imageURL,
              originCountryName: fruit.originCountryName
            };
            console.log('Processed fruit (with _doc):', processed);
            return processed;
          }
          
          const processed = {
            id: (fruit._id || fruit.id)?.toString(),
            name: fruit.name,
            price: fruit.price,
            originCountryId: fruit.originCountryId,
            imageURL: fruit.imageURL,
            originCountryName: fruit.originCountryName
          };
          console.log('Processed fruit (without _doc):', processed);
          return processed;
        };

        
        if (fruitsData.data && Array.isArray(fruitsData.data)) {
          const processedFruits = fruitsData.data.map(processFruitData);
          console.log('All processed fruits:', processedFruits);
          setFruitOptions(processedFruits);
        } else if (Array.isArray(fruitsData)) {
          const processedFruits = fruitsData.map(processFruitData);
          console.log('All processed fruits:', processedFruits);
          setFruitOptions(processedFruits);
        } else {
          console.warn('Unexpected fruits data format:', fruitsData);
          setFruitOptions([]);
        }

        
        const processLocationData = (location) => {
          if (location._doc) {
            return {
              id: location._doc._id?.toString(),
              name: location._doc.name,
              type: location._doc.type,
              address: location._doc.address,
              manager: location._doc.manager
            };
          }
          return {
            id: (location._id || location.id)?.toString(),
            name: location.name,
            type: location.type,
            address: location.address,
            manager: location.manager
          };
        };

        if (locationsData.data && Array.isArray(locationsData.data)) {
          const processedLocations = locationsData.data.map(processLocationData);
          setShopOptions(processedLocations);
        } else if (Array.isArray(locationsData)) {
          const processedLocations = locationsData.map(processLocationData);
          setShopOptions(processedLocations);
        } else {
          console.warn('Unexpected locations data format:', locationsData);
          setShopOptions([]);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
        setErrors({ submit: `Failed to load data: ${error.message}` });
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        setAuthLoading(true);
        const authStatus = await AuthService.checkAuthStatus();
        
        if (authStatus.isLoggedIn && authStatus.email) {
          const userJson = await fetch(`${GetApi.api}/staff/information/${authStatus.email}`, {
            credentials: 'include'
          });
          
          if (!userJson.ok) {
            throw new Error(`Failed to fetch staff info: ${userJson.status}`);
          }
          
          const userget = await userJson.json();
          console.log('Staff information:', userget);
          
          if (userget.staff) {
            setStaffInfo(userget.staff);

            
            if (userget.staff.locationId) {
              console.log('Staff locationId:', userget.staff.locationId);
              console.log('Available shops:', shopOptions);
              
              
              const matchedShop = shopOptions.find(shop => 
                shop.id === userget.staff.locationId || 
                shop.id.toString() === userget.staff.locationId.toString() ||
                shop._id === userget.staff.locationId ||
                shop._id?.toString() === userget.staff.locationId.toString()
              );

              console.log('Matched shop:', matchedShop);

              if (matchedShop) {
                setFormData(prev => ({
                  ...prev,
                  fromShopId: matchedShop.id.toString()
                }));
                setShopMatchError('');
              } else {
                setShopMatchError(`No shop found matching your location ID: ${userget.staff.locationId}. Please contact administrator.`);
                console.warn('No shop match found for locationId:', userget.staff.locationId);
              }
            } else {
              setShopMatchError('No location assigned to your account. Please contact administrator.');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch staff information:', error);
        setErrors(prev => ({ ...prev, submit: 'Failed to load staff information' }));
      } finally {
        setAuthLoading(false);
      }
    };

    
    if (shopOptions.length > 0) {
      fetchStaffInfo();
    }
  }, [shopOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    if (name === 'fromShopId') {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fromShopId) {
      newErrors.fromShopId = 'Unable to determine source shop';
    }

    if (!formData.toShopId) {
      newErrors.toShopId = 'Please select destination shop';
    } else if (formData.fromShopId === formData.toShopId) {
      newErrors.toShopId = 'Source and destination cannot be the same';
    }

    if (!formData.fruitId) {
      newErrors.fruitId = 'Please select fruit type';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Please enter valid quantity';
    }

    if (!formData.borrowDate) {
      newErrors.borrowDate = 'Please select borrow date';
    }

    if (!formData.returnDate) {
      newErrors.returnDate = 'Please select return date';
    } else if (formData.borrowDate && new Date(formData.returnDate) <= new Date(formData.borrowDate)) {
      newErrors.returnDate = 'Return date must be after borrow date';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (shopMatchError) {
      setErrors({ submit: shopMatchError });
      return;
    }
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      
      const generateId = () => {
        return Date.now() % 1000000; 
      };

      const borrowData = {
        _id: generateId(), 
        fromShopId: parseInt(formData.fromShopId),
        toShopId: parseInt(formData.toShopId),
        fruitId: parseInt(formData.fruitId),
        quantity: parseInt(formData.quantity),
        borrowDate: new Date(formData.borrowDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
        status: "false"
      };

      const submitData = {
        borrowsArray: [borrowData]
      };

      console.log('Sending data with _id:', JSON.stringify(submitData, null, 2));

      const response = await fetch(`${GetApi.api}/borrows/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      console.log(' Response status:', response.status);
      
      let result;
      try {
        result = await response.json();
        console.log(' Response data:', result);
      } catch (parseError) {
        console.error(' Failed to parse response:', parseError);
        const textResponse = await response.text();
        console.log(' Raw response:', textResponse);
        throw new Error(`Server returned invalid JSON: ${textResponse}`);
      }

      if (response.ok && result.success) {
        setSubmitSuccess(true);
        setFormData(prev => ({
          ...prev,
          toShopId: '',
          fruitId: '',
          quantity: '',
          borrowDate: '',
          returnDate: ''
        }));
        setErrors({});
      } else {
        const errorMessage = result.error || result.message || 
                            `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(' Submission failed:', error);
      setErrors({ 
        submit: `submit false: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinReturnDate = () => {
    return formData.borrowDate || getTodayDate();
  };

  const getSelectedShop = (shopId) => {
    return shopOptions.find(shop => 
      shop.id === shopId || 
      shop.id.toString() === shopId.toString()
    );
  };

  const getSelectedFruit = (fruitId) => {
    return fruitOptions.find(fruit => 
      fruit.id === fruitId || 
      fruit.id.toString() === fruitId.toString()
    );
  };

  
  const currentShop = getSelectedShop(formData.fromShopId);

  
  if (authLoading || dataLoading) {
    return (
      <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ my: 4 }} />
        <Typography variant="h6" color="text.secondary">
          Loading data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto' }}>
      
      
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
          <SwapHoriz sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Fruit Transfer Request
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage inventory transfers between shop locations
        </Typography>
      </Box>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          
          
          {staffInfo && (
            <Alert 
              severity="info" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<Store />}
            >
              <Typography variant="body1" fontWeight="bold">
                Staff: {staffInfo.name} ({staffInfo.job})
              </Typography>
              <Typography variant="body2">
                Email: {staffInfo.email} • Phone: {staffInfo.phone}
              </Typography>
            </Alert>
          )}

          
          {shopMatchError && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="body1" fontWeight="bold">
                Shop Configuration Issue
              </Typography>
              {shopMatchError}
            </Alert>
          )}

          
          {currentShop && !shopMatchError && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<Store />}
            >
              <Typography variant="body1" fontWeight="bold">
                Current Shop: {currentShop.name}
              </Typography>
              <Typography variant="body2">
                Address: {currentShop.address} • Type: {currentShop.type}
              </Typography>
            </Alert>
          )}

          
          {submitSuccess && (
            <Alert 
              icon={<CheckCircle fontSize="inherit" />}
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="h6">
                Request Submitted Successfully!
              </Typography>
              Your borrow request has been sent for approval.
            </Alert>
          )}

          
          {errors.submit && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              
              

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Source Shop"
                value={currentShop ? `${currentShop.address} (${currentShop.type})` : 'No shop assigned'}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Store color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText={shopMatchError || "Automatically set to your assigned shop"}
                error={!!shopMatchError}
                disabled={!!shopMatchError}
              />
              <input type="hidden" name="fromShopId" value={formData.fromShopId} />
            </Grid>

              
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Destination Shop"
                  name="toShopId"
                  value={formData.toShopId}
                  onChange={handleChange}
                  error={!!errors.toShopId}
                  helperText={errors.toShopId || "Select where to transfer the fruits"}
                  required
                  disabled={!!shopMatchError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Store color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {shopOptions
                    .filter(shop => shop.id.toString() !== formData.fromShopId)
                    .map(shop => (
                    <MenuItem key={shop.id} value={shop.id}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1">
                          {shop.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {shop.type} • {shop.address}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Fruit Type"
                  name="fruitId"
                  value={formData.fruitId}
                  onChange={handleChange}
                  error={!!errors.fruitId}
                  helperText={errors.fruitId || "Select the fruit to transfer"}
                  required
                  disabled={!!shopMatchError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalGroceryStore color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {fruitOptions.map(fruit => (
                    <MenuItem key={fruit.id} value={fruit.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                          <Typography>{fruit.name}</Typography>
                          {fruit.originCountryName && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Origin: {fruit.originCountryName}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          ${fruit.price}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity || "Enter the number of items to transfer"}
                  inputProps={{ min: 1 }}
                  required
                  disabled={!!shopMatchError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Numbers color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Borrow Date"
                  name="borrowDate"
                  value={formData.borrowDate}
                  onChange={handleChange}
                  error={!!errors.borrowDate}
                  helperText={errors.borrowDate || "Select when the transfer should occur"}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDate() }}
                  required
                  disabled={!!shopMatchError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Return Date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  error={!!errors.returnDate}
                  helperText={errors.returnDate || "Select when the items should be returned"}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getMinReturnDate() }}
                  required
                  disabled={!!shopMatchError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !!shopMatchError}
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                sx={{ 
                  px: 6, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  minWidth: 200
                }}
              >
                {loading ? 'Submitting...' : shopMatchError ? 'Configuration Issue' : 'Submit Transfer Request'}
              </Button>
            </Box>
          </Box>

          
          {(formData.fromShopId || formData.toShopId || formData.fruitId) && !shopMatchError && (
            <Paper sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.300' }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 Request Preview
              </Typography>
              <Grid container spacing={2}>
                {formData.fromShopId && currentShop && (
                  <Grid item xs={12} md={6}>
                    <Chip 
                      label={`From: ${currentShop.name}`}
                      variant="outlined"
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                )}
                {formData.toShopId && (
                  <Grid item xs={12} md={6}>
                    <Chip 
                      label={`To: ${getSelectedShop(formData.toShopId)?.name}`}
                      variant="outlined"
                      color="secondary"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                )}
                {formData.fruitId && (
                  <Grid item xs={12} md={6}>
                    <Chip 
                      label={`Fruit: ${getSelectedFruit(formData.fruitId)?.name}`}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                )}
                {formData.quantity && (
                  <Grid item xs={12} md={6}>
                    <Chip 
                      label={`Quantity: ${formData.quantity} items`}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                )}
                {formData.borrowDate && (
                  <Grid item xs={12} md={6}>
                    <Chip 
                      label={`Borrow: ${new Date(formData.borrowDate).toLocaleDateString()}`}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                )}
                {formData.returnDate && (
                  <Grid item xs={12} md={6}>
                    <Chip 
                      label={`Return: ${new Date(formData.returnDate).toLocaleDateString()}`}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RequestBorrow;