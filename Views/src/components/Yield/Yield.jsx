import React from 'react';
import { Box, Alert } from '@mui/material';
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
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
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
  );
};

export default MonthlyYieldReport;