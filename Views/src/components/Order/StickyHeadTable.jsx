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
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { id: '_id', label: 'ID', minWidth: 150 },
  { id: 'fruitId', label: 'Fruit ID', minWidth: 80 },
  { id: 'fruitName', label: 'Fruit Name', minWidth: 120 },
  { id: 'locationId', label: 'Location ID', minWidth: 80 },
  { id: 'locationName', label: 'Location Name', minWidth: 190 },
  {
    id: 'quantity',
    label: 'Quantity',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 220,
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
      <Paper sx={{ width: '100%', p: 3, textAlign: 'center' }}>
        <h1>Inventory List</h1>
        <div>Loading...</div>
      </Paper>
    );
  }

  
  if (error) {
    return (
      <Paper sx={{ width: '100%', p: 3, textAlign: 'center' }}>
        <h1>Inventory List</h1>
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
        <h1 style={{ margin: '0 0 16px 0' }}>Inventory List</h1>
        
        
        {staffInfo && staffLocationId && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Showing inventory for your location: {staffInfo.name} ({staffInfo.job}) - Location ID: {staffLocationId}
          </Alert>
        )}

        {!staffLocationId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
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
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        
        <Box sx={{ mb: 1 }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Showing {filteredData.length} of {inventoryData.length} inventory items
            {staffLocationId && ` (filtered by your location)`}
            {searchTerm && ' and search'}
          </span>
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="inventory table">
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
                                  minWidth: '80px'
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