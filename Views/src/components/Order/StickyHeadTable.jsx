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
import GetApi from '../GetAPI/Getapi';
import AuthService from '../../utils/auth';
import {
  Box,
  TextField,
  InputAdornment,
  Alert,
  Typography,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { id: '_id', label: 'ID', minWidth: 100 },
  { id: 'fruitName', label: 'Fruit Name', minWidth: 100 },
  { id: 'locationId', label: 'Location ID', minWidth: 70 },
  { id: 'locationName', label: 'Location Name', minWidth: 150 },
  {
    id: 'quantity',
    label: 'Quantity',
    minWidth: 90,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 150,
    align: 'center',
  },
];

export default function InventoryTable({ onEditInventory }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [inventoryData, setInventoryData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [staffLocationId, setStaffLocationId] = React.useState(null);
  const [staffInfo, setStaffInfo] = React.useState(null);

  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        
        const authStatus = await AuthService.checkAuthStatus();
        if (authStatus.success && authStatus.isLoggedIn) {
          const userJson = await fetch(`${GetApi.api}/staff/information/${authStatus.email}`, {
            credentials: 'include'
          });
          
          if (userJson.ok) {
            const userData = await userJson.json();
            console.log('Staff information:', userData);
            
            if (userData.staff && userData.staff.locationId) {
              setStaffLocationId(userData.staff.locationId.toString());
              setStaffInfo(userData.staff);
            }
          }
        }

        
        const response = await fetch(GetApi.api + '/inventory/list');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data); 
        
        
        if (data.data && Array.isArray(data.data)) {
          setInventoryData(data.data);
        } else if (Array.isArray(data)) {
          setInventoryData(data);
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

    fetchData();
  }, []);

  
  React.useEffect(() => {
    let filtered = inventoryData;

    
    if (staffLocationId) {
      filtered = filtered.filter(item => 
        item.locationId && item.locationId.toString() === staffLocationId
      );
    }

    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        (item.fruitName && item.fruitName.toLowerCase().includes(term)) ||
        (item.locationName && item.locationName.toLowerCase().includes(term)) ||
        (item.fruitId && item.fruitId.toString().toLowerCase().includes(term)) ||
        (item.locationId && item.locationId.toString().toLowerCase().includes(term)) ||
        (item._id && item._id.toString().toLowerCase().includes(term))
      );
    }

    setFilteredData(filtered);
    setPage(0); 
  }, [inventoryData, staffLocationId, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (inventory) => {
    if (onEditInventory) {
      onEditInventory(inventory);
    } else {
      console.log('Edit clicked for:', inventory);
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
          Inventory List
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
          Inventory List
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
    <Paper sx={{ 
      width: '100%',
      maxWidth: 1400,
      margin: '0 auto',
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
            Inventory List
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            View and manage inventory across all locations
          </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        
        
        {staffInfo && staffLocationId && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            Showing inventory for your location: {staffInfo.name} ({staffInfo.job}) - Location ID: {staffLocationId}
          </Alert>
        )}

        {!staffLocationId && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            Unable to determine your location. Showing all inventory records.
          </Alert>
        )}
        
        
        <TextField
          fullWidth
          size="small"
          placeholder="Search by fruit name, location name, ID..."
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
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
              },
            },
          }}
        />

        
        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }} component="span">
            Showing {filteredData.length} of {inventoryData.length} inventory items
            {staffLocationId && ` (filtered by your location)`}
            {searchTerm && ' and search'}
          </Typography>
        </Box>
      </Box>

      <TableContainer sx={{ 
        maxHeight: 600,
        borderRadius: 2,
        border: '1px solid #e2e8f0',
      }}>
        <Table stickyHeader aria-label="inventory table">
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
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  {inventoryData.length === 0 
                    ? 'No inventory records found' 
                    : staffLocationId 
                      ? 'No inventory items found for your location' + (searchTerm ? ' matching your search' : '')
                      : 'No items match your search'
                  }
                </TableCell>
              </TableRow>
            ) : (
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
                        
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
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