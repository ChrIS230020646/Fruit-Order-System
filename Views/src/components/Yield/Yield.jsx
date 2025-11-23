import React from 'react';
import { Box, Alert, Paper, Typography } from '@mui/material';
import { useYieldData } from './hooks/useYieldData';
import { useYieldCalculations } from './hooks/useYieldCalculations';
import LoadingState from './components/LoadingState';
import KeyMetrics from './components/KeyMetrics';
import PieChartSection from './components/PieChartSection';
import MonthlyTable from './components/MonthlyTable';


const MonthlyYieldReport = () => {
  const { yieldData, loading, error, reportData } = useYieldData();
  const {
    monthlyReport,
    yearlyTotals,
    monthlyAverages,
    peakMonth,
    fruitTypes,
    pieChartData,
    getFruitColor
  } = useYieldCalculations(yieldData);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      {/* 統一的標題區 */}
      <Paper sx={{ 
        mb: 4,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <Box sx={{ 
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
            Monthly Delivery Report - {new Date().getFullYear()}
          </Typography>
          {reportData && (
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem', color: 'white' }}>
              Based on {reportData.summary?.deliveredCount || 0} delivered shipments
            </Typography>
          )}
        </Box>
      </Paper>

      <Box sx={{ px: 3, pb: 3 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <KeyMetrics 
          yearlyTotals={yearlyTotals}
          monthlyAverages={monthlyAverages}
          peakMonth={peakMonth}
          fruitTypes={fruitTypes}
          reportData={reportData}
        />

        <PieChartSection 
          pieChartData={pieChartData}
          fruitTypes={fruitTypes}
          yearlyTotals={yearlyTotals}
          monthlyAverages={monthlyAverages}
          getFruitColor={getFruitColor}
        />

        <MonthlyTable 
          monthlyReport={monthlyReport}
          fruitTypes={fruitTypes}
          yearlyTotals={yearlyTotals}
        />
      </Box>
    </Box>
  );
};

export default MonthlyYieldReport;