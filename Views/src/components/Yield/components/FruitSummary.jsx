import React from 'react';
import { Card, CardContent, Typography, Grid, Paper, Box, Chip, LinearProgress } from '@mui/material';

const FruitSummary = ({ fruitTypes, yearlyTotals, monthlyAverages, getFruitColor }) => {
  return (
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        mb: 3,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'text.primary',
      }}>
        <Box sx={{ 
          width: 4, 
          height: 24, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 1,
        }} />
        Fruit Delivery Summary
      </Typography>
        <Grid container spacing={2}>
          {fruitTypes.map(fruit => (
            <Grid item xs={12} sm={6} key={fruit}>
              <Paper sx={{ 
                p: 2.5, 
                bgcolor: 'background.paper',
                borderLeft: `4px solid ${getFruitColor(fruit)}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateX(4px)',
                },
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', color: 'text.primary' }}>
                    {fruit}
                  </Typography>
                  <Chip 
                    label={`${((yearlyTotals[fruit] / yearlyTotals.total) * 100).toFixed(1)}%`}
                    size="small"
                    sx={{ 
                      backgroundColor: getFruitColor(fruit), 
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  />
                </Box>
                <Typography variant="h5" sx={{ 
                  color: getFruitColor(fruit),
                  fontWeight: 700,
                  mb: 0.5,
                }}>
                  {yearlyTotals[fruit].toLocaleString('en-US')} 
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Avg: {monthlyAverages[fruit].toLocaleString('en-US')}/month
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(yearlyTotals[fruit] / yearlyTotals.total) * 100}
                  sx={{ 
                    mt: 1, 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: `${getFruitColor(fruit)}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getFruitColor(fruit),
                      borderRadius: 4,
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
  );
};

export default FruitSummary;