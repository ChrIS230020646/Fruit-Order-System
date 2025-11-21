import { useState, useEffect } from 'react';
import GetApi from '../../GetAPI/Getapi';  

export const useYieldData = () => {
  const [yieldData, setYieldData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchDeliveryReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${GetApi.api}/deliveries/report`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setReportData(result.data);
          setYieldData(result.data.monthlyData);
          
          localStorage.setItem('monthlyYieldData', JSON.stringify(result.data.monthlyData));
          localStorage.setItem('deliveryReportData', JSON.stringify(result.data));
        } else {
          throw new Error(result.message || 'Data retrieval failed');
        }
      } catch (err) {
        console.error('Error fetching delivery report:', err);
        setError(err.message);
        
        const savedData = localStorage.getItem('monthlyYieldData');
        const savedReportData = localStorage.getItem('deliveryReportData');
        if (savedData && savedReportData) {
          setYieldData(JSON.parse(savedData));
          setReportData(JSON.parse(savedReportData));
          setError('Use cached data: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryReport();
  }, []);

  return { yieldData, loading, error, reportData };
};