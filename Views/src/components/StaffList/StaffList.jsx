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
        
        if (data.data && Array.isArray(data.data)) {
          setStaffData(data.data);
          setFilteredData(data.data);
        } else if (Array.isArray(data)) {
          setStaffData(data);
          setFilteredData(data);
        } else {
          throw new Error('Invalid data format received from API');
        }
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
    if (searchTerm.trim() === '') {
      setFilteredData(staffData);
      setPage(0);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = staffData.filter(staff => 
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
      setFilteredData(filtered);
      setPage(0); // 重置到第一页
    }
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
      <Paper sx={{ width: '100%', p: 3, textAlign: 'center' }}>
        <h1>Staff List</h1>
        <div>Loading...</div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: '100%', p: 3, textAlign: 'center' }}>
        <h1>Staff List</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <h1 style={{ margin: 0, marginBottom: 2 }}>Staff List</h1>
        
        {/* 搜索栏 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2,
          mb: 2 
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
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 300,
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
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

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="staff table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
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
                                  minWidth: '80px'
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
  );
}