import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const MonthlyTable = ({ monthlyReport, fruitTypes, yearlyTotals }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Detailed Monthly Delivery Report
        </Typography>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                {fruitTypes.map(fruit => (
                  <TableCell key={fruit} align="center" sx={{ textTransform: 'capitalize' }}>
                    {fruit}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyReport.map((monthData, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    {monthData.monthName}
                  </TableCell>
                  {fruitTypes.map(fruit => (
                    <TableCell key={fruit} align="center">
                      {monthData[fruit] || 0}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>
                    {monthData.total}
                  </TableCell>
                </TableRow>
              ))}
              
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                  Yearly Total
                </TableCell>
                {fruitTypes.map(fruit => (
                  <TableCell key={fruit} align="center" sx={{ fontWeight: 'bold', color: 'white' }}>
                    {yearlyTotals[fruit]}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white', backgroundColor: 'primary.main' }}>
                  {yearlyTotals.total}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyTable;