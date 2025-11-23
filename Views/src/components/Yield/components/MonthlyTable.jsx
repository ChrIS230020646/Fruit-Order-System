import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

const MonthlyTable = ({ monthlyReport, fruitTypes, yearlyTotals }) => {
  return (
    <Card sx={{ 
      borderRadius: 3,
      boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.primary',
          }}>
            <Box sx={{ 
              width: 4, 
              height: 24, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 1,
            }} />
            Detailed Monthly Delivery Report
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  backgroundColor: (theme) => theme.palette.mode === 'dark' 
                    ? '#1a202c' 
                    : '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: (theme) => theme.palette.mode === 'dark' 
                    ? '#ffffff' 
                    : theme.palette.text.primary,
                  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}>
                  Month
                </TableCell>
                {fruitTypes.map(fruit => (
                  <TableCell 
                    key={fruit} 
                    align="center" 
                    sx={{ 
                      textTransform: 'capitalize',
                      backgroundColor: (theme) => theme.palette.mode === 'dark' 
                        ? '#1a202c' 
                        : '#f8fafc',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: (theme) => theme.palette.mode === 'dark' 
                        ? '#ffffff' 
                        : theme.palette.text.primary,
                      borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                    }}
                  >
                    {fruit}
                  </TableCell>
                ))}
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' 
                      ? '#1a202c' 
                      : '#f8fafc',
                    fontSize: '0.875rem',
                    color: (theme) => theme.palette.mode === 'dark' 
                      ? '#ffffff' 
                      : theme.palette.text.primary,
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyReport.map((monthData, index) => (
                <TableRow 
                  key={index}
                  sx={{
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : '#f8fafc',
                    },
                    '&:nth-of-type(even)': {
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.02)'
                        : '#fafbfc',
                    },
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                  }}>
                    {monthData.monthName}
                  </TableCell>
                  {fruitTypes.map(fruit => (
                    <TableCell 
                      key={fruit} 
                      align="center"
                      sx={{
                        color: 'text.primary',
                      }}
                    >
                      {(monthData[fruit] || 0).toLocaleString('en-US')}
                    </TableCell>
                  ))}
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: 700, 
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.15)'
                        : '#f0f4ff',
                      color: 'primary.main',
                    }}
                  >
                    {monthData.total.toLocaleString('en-US')}
                  </TableCell>
                </TableRow>
              ))}
              
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  fontSize: '1rem',
                }}>
                  Yearly Total
                </TableCell>
                {fruitTypes.map(fruit => (
                  <TableCell 
                    key={fruit} 
                    align="center" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white',
                      fontSize: '1rem',
                    }}
                  >
                    {yearlyTotals[fruit].toLocaleString('en-US')}
                  </TableCell>
                ))}
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    fontSize: '1.1rem',
                  }}
                >
                  {yearlyTotals.total.toLocaleString('en-US')}
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