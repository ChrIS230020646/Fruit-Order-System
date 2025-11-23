import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import GetApi from '../GetAPI/Getapi';

const columns = [
  { id: '_id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 150 },
  { id: 'phone', label: 'Phone', minWidth: 120 },
  { id: 'job', label: 'Job Position', minWidth: 100 },
  { id: 'locationId', label: 'Location ID', minWidth: 100 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'center',
    format: (value) => value ? 'Active' : 'Inactive',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
    align: 'center',
  },
];

export default function StaffTable({ onEditStaff }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [staffData, setStaffData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        const response = await fetch(GetApi.api + '/staff');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        let staffArray;
        if (data.data && Array.isArray(data.data)) {
          staffArray = data.data;
        } else if (Array.isArray(data)) {
          staffArray = data;
        } else {
          throw new Error('Invalid data format received from API');
        }
        
        // 按ID升序排序
        const sortedStaff = staffArray.sort((a, b) => {
          const idA = Number(a._id) || 0;
          const idB = Number(b._id) || 0;
          return idA - idB;
        });
        
        setStaffData(sortedStaff);
        setFilteredData(sortedStaff);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network request failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  // 搜索功能
  React.useEffect(() => {
    let filtered;
    if (searchTerm.trim() === '') {
      filtered = staffData;
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = staffData.filter(staff => 
        columns.some(column => {
          const value = staff[column.id];
          if (value == null) return false;
          
          // 跳过 actions 列
          if (column.id === 'actions') return false;
          
          // 特殊处理状态列
          if (column.id === 'status') {
            const statusText = value ? 'active' : 'inactive';
            return statusText.includes(lowercasedSearch);
          }
          
          // 普通文本搜索
          return value.toString().toLowerCase().includes(lowercasedSearch);
        })
      );
    }
    
    // 按ID升序排序
    filtered = filtered.sort((a, b) => {
      const idA = Number(a._id) || 0;
      const idB = Number(b._id) || 0;
      return idA - idB;
    });
    
    setFilteredData(filtered);
    setPage(0); // 重置到第一页
  }, [searchTerm, staffData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (staff) => {
    if (onEditStaff) {
      onEditStaff(staff);
    } else {
      console.log('Edit clicked for:', staff);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      <Paper sx={{ 
        width: '100%', 
        p: 4, 
        textAlign: 'center',
        borderRadius: 3,
        background: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
          Staff List
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={40} />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ 
        width: '100%', 
        p: 4, 
        textAlign: 'center',
        borderRadius: 3,
        background: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
          Staff List
        </Typography>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Error: {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ 
            mt: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
            },
          }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto', width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
    <Paper sx={{ 
      width: '100%', 
      overflow: 'hidden',
      borderRadius: 3,
      boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
          Staff List
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
          Manage and view all staff members
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        
        {/* 搜索栏 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2,
          mb: 3 
        }}>
          <TextField
            placeholder="Search staff by name, email, phone, job..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 300,
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                },
              }
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`Total: ${staffData.length}`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={`Showing: ${filteredData.length}`} 
              color={filteredData.length !== staffData.length ? "secondary" : "default"}
              variant="outlined" 
            />
          </Box>
        </Box>
      </Box>

      <TableContainer sx={{ 
        maxHeight: 600,
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        mx: 3,
        mb: 3,
        width: 'calc(100% - 48px)',
        maxWidth: 'calc(100% - 48px)',
      }}>
        <Table stickyHeader aria-label="staff table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ 
                    minWidth: column.minWidth,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' 
                      ? '#1a202c' 
                      : '#4A90E2',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: (theme) => theme.palette.mode === 'dark' 
                      ? '#ffffff' 
                      : theme.palette.text.primary,
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        
                        if (column.id === 'actions') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditClick(row)}
                                sx={{
                                  textTransform: 'none',
                                  minWidth: '80px',
                                  borderRadius: 2,
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  '&:hover': {
                                    borderColor: 'primary.dark',
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                  },
                                }}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          );
                        }

                        if (column.id === 'status') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Chip 
                                label={value ? 'Active' : 'Inactive'} 
                                color={value ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                          );
                        }
                        
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value || '-'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {searchTerm ? 'No matching staff found' : 'No staff data available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />
    </Paper>
    </Box>
  );
}