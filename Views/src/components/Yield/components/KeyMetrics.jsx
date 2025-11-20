import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import { BarChart, Agriculture, TrendingUp, Inventory, PieChart } from '@mui/icons-material';

const KeyMetrics = ({ yearlyTotals, monthlyAverages, peakMonth, fruitTypes, reportData }) => {
  return (
    <>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        <BarChart sx={{ mr: 2, verticalAlign: 'middle' }} />
        Monthly Delivery Report - {new Date().getFullYear()}
        {reportData && (
          <Typography variant="subtitle1" color="text.secondary" align="center">
            Based on {reportData.summary?.deliveredCount || 0} delivered shipments
          </Typography>
        )}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Agriculture color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {yearlyTotals.total}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Total Delivered
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fruitTypes.length} fruit types
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {monthlyAverages.total}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Monthly Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Inventory color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {peakMonth.monthEn}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Peak Month ({peakMonth.total})
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PieChart color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="secondary.main">
                {fruitTypes.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
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