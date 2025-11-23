import { useMemo } from 'react';
import { months } from '../utiles/constants';
import { getFruitColor } from '../utiles/helpers';

export const useYieldCalculations = (yieldData) => {
  
  const getAllFruitTypes = useMemo(() => {
    return () => {
      const fruitTypes = new Set();
      Object.values(yieldData).forEach(monthData => {
        Object.keys(monthData).forEach(fruit => {
          fruitTypes.add(fruit);
        });
      });
      return Array.from(fruitTypes).sort();
    };
  }, [yieldData]);

  
  const calculateMonthlyReport = useMemo(() => {
    return () => {
      const fruitTypes = getAllFruitTypes();
      
      return months.map(month => {
        const monthData = yieldData[month.value] || {};
        const monthlyTotal = fruitTypes.reduce((sum, fruit) => sum + (monthData[fruit] || 0), 0);
        
        return {
          month: month.value,
          monthName: month.label,
          monthEn: month.en,
          ...monthData,
          total: monthlyTotal
        };
      });
    };
  }, [yieldData, getAllFruitTypes]);

  
  const calculateYearlyTotals = useMemo(() => {
    return (report) => {
      const fruitTypes = getAllFruitTypes();
      const totals = { total: 0 };
      
      fruitTypes.forEach(fruit => {
        totals[fruit] = report.reduce((sum, month) => sum + (month[fruit] || 0), 0);
      });
      
      totals.total = fruitTypes.reduce((sum, fruit) => sum + totals[fruit], 0);
      
      return totals;
    };
  }, [getAllFruitTypes]);

  
  const calculateMonthlyAverages = useMemo(() => {
    return (totals) => {
      const fruitTypes = getAllFruitTypes();
      const averages = { total: Math.round(totals.total / 12) };
      
      fruitTypes.forEach(fruit => {
        averages[fruit] = Math.round(totals[fruit] / 12);
      });
      
      return averages;
    };
  }, [getAllFruitTypes]);

  
  const findPeakMonth = useMemo(() => {
    return (report) => {
      return report.reduce((peak, month) => 
        month.total > peak.total ? month : peak, { total: 0 }
      );
    };
  }, []);

  
  const generatePieChartData = useMemo(() => {
    return () => {
      const fruitTypes = getAllFruitTypes();
      const yearlyTotals = calculateYearlyTotals(calculateMonthlyReport());
      
      return fruitTypes.map(fruit => ({
        name: fruit.charAt(0).toUpperCase() + fruit.slice(1),
        value: yearlyTotals[fruit],
        percentage: ((yearlyTotals[fruit] / yearlyTotals.total) * 100).toFixed(1),
        color: getFruitColor(fruit)
      }));
    };
  }, [getAllFruitTypes, calculateYearlyTotals, calculateMonthlyReport]);

  const fruitTypes = useMemo(() => getAllFruitTypes(), [getAllFruitTypes]);
  const monthlyReport = useMemo(() => calculateMonthlyReport(), [calculateMonthlyReport]);
  const yearlyTotals = useMemo(() => calculateYearlyTotals(monthlyReport), [calculateYearlyTotals, monthlyReport]);
  const monthlyAverages = useMemo(() => calculateMonthlyAverages(yearlyTotals), [calculateMonthlyAverages, yearlyTotals]);
  const peakMonth = useMemo(() => findPeakMonth(monthlyReport), [findPeakMonth, monthlyReport]);
  const pieChartData = useMemo(() => generatePieChartData(), [generatePieChartData]);

  return {
    monthlyReport,
    yearlyTotals,
    monthlyAverages,
    peakMonth,
    fruitTypes,
    pieChartData,
    getFruitColor
  };
};