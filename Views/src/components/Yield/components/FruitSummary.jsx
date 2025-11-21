import React from 'react';
import { Card, CardContent, Typography, Grid, Paper, Box, Chip, LinearProgress } from '@mui/material';

const FruitSummary = ({ fruitTypes, yearlyTotals, monthlyAverages, getFruitColor }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Fruit Delivery Summary
        </Typography>
        <Grid container spacing={2}>
          {fruitTypes.map(fruit => (
            <Grid item xs={12} sm={6} key={fruit}>
              <Paper sx={{ p: 2, borderLeft: `4px solid ${getFruitColor(fruit)}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    {fruit}
                  </Typography>
                  <Chip 
                    label={`${((yearlyTotals[fruit] / yearlyTotals.total) * 100).toFixed(1)}%`}
                    size="small"
                    sx={{ backgroundColor: getFruitColor(fruit), color: 'white' }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: getFruitColor(fruit) }}>
                  {yearlyTotals[fruit]} 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg: {monthlyAverages[fruit]}/month
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(yearlyTotals[fruit] / yearlyTotals.total) * 100}
                  sx={{ 
                    mt: 1, 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: `${getFruitColor(fruit)}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getFruitColor(fruit)
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FruitSummary;