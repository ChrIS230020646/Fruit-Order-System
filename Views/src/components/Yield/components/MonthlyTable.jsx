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
          background: '#4A90E2',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'white', 
          }}>
            <Box sx={{ 
              width: 4, 
              height: 24, 
              background: 'white',
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
                    : '#8AB8E8',
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
                        : '#8AB8E8',
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
                      : '#8AB8E8',
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
                >
                  <TableCell sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    backgroundColor: '#00000',
                  }}>
                    {monthData.monthName}
                  </TableCell>
                  {fruitTypes.map(fruit => (
                    <TableCell 
                      key={fruit} 
                      align="center"
                      sx={{
                        color: 'text.primary',
                        backgroundColor: '#808080', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#4b5563', 
                          color: '#d1d5db',
                          fontWeight: 600,
                        },
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
                        ? 'rgba(99, 102, 241, 0.25)' 
                        : '#54534D', 
                      color: 'primary.main',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(99, 102, 241, 0.4)' 
                          : '#c7d2fe',
                        color: 'primary.dark',
                        fontWeight: 800,
                      },
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