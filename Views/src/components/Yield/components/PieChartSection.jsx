import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper } from '@mui/material';
import { PieChart } from '@mui/icons-material';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import FruitSummary from './FruitSummary';


const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper sx={{ 
        p: 2, 
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 3
      }} elevation={3}>
        <Typography variant="body2" fontWeight="bold" color="text.primary">
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          quantity: {data.value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Proportion: {data.percentage}%
        </Typography>
      </Paper>
    );
  }
  return null;
};

const PieChartSection = ({ pieChartData, fruitTypes, yearlyTotals, monthlyAverages, getFruitColor }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
            transform: 'translateY(-2px)',
          },
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ 
              fontWeight: 600,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: 'text.primary',
            }}>
              <PieChart sx={{ fontSize: 24, color: 'primary.main' }} />
              Fruit Distribution Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(value, entry) => {
                      // Get theme-aware text color
                      const isDark = document.documentElement.getAttribute('data-toolpad-color-scheme') === 'dark';
                      return (
                        <span style={{ 
                          color: isDark ? '#ffffff' : entry.color, 
                          fontSize: '12px' 
                        }}>
                          {value}
                        </span>
                      );
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
            transform: 'translateY(-2px)',
          },
        }}>
          <FruitSummary 
            fruitTypes={fruitTypes}
            yearlyTotals={yearlyTotals}
            monthlyAverages={monthlyAverages}
            getFruitColor={getFruitColor}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default PieChartSection;