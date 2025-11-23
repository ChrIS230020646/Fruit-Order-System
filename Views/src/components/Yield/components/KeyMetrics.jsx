import React from 'react';
import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { BarChart, Agriculture, TrendingUp, Inventory, PieChart } from '@mui/icons-material';

const KeyMetrics = ({ yearlyTotals, monthlyAverages, peakMonth, fruitTypes, reportData }) => {
  return (
    <>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Agriculture color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                {yearlyTotals.total}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                Total Delivered
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fruitTypes.length} fruit types
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUp color="success" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 700, mb: 1 }}>
                {monthlyAverages.total}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                Monthly Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Inventory color="warning" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700, mb: 1 }}>
                {peakMonth.monthEn}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                Peak Month ({peakMonth.total})
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <PieChart color="secondary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700, mb: 1 }}>
                {fruitTypes.length}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                Fruit Types
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Distribution
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default KeyMetrics;