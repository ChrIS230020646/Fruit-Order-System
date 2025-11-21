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
      <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} elevation={3}>
        <Typography variant="body2" fontWeight="bold">
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
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom align="center">
              <PieChart sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: '12px' }}>
                        {value}
                      </span>
                    )}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      
      <Grid item xs={12} md={6}>
        <FruitSummary 
          fruitTypes={fruitTypes}
          yearlyTotals={yearlyTotals}
          monthlyAverages={monthlyAverages}
          getFruitColor={getFruitColor}
        />
      </Grid>
    </Grid>
  );
};

export default PieChartSection;