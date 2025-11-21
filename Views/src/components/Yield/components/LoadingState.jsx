import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ ml: 2 }}>
        loading...
      </Typography>
    </Box>
  );
};

export default LoadingState;