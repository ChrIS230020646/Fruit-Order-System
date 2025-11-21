
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import GetApi from '../GetAPI/Getapi';


const columns = [
  { id: '_id', label: 'ID', minWidth: 50 },
  { id: 'fruitId', label: 'Fruit ID', minWidth: 80 },
  { id: 'fruitName', label: 'Fruit Name', minWidth: 120 },
  { id: 'locationId', label: 'Location ID', minWidth: 80 },
  { id: 'locationName', label: 'Location Name', minWidth: 170 },
  {
    id: 'quantity',
    label: 'Quantity',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  }
];

export default function InventoryTable({ onEditInventory }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [inventoryData, setInventoryData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  
  React.useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(GetApi.api + '/inventory/list');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data); 
        
        
        if (data.data && Array.isArray(data.data)) {
          setInventoryData(data.data);
          setFilteredData(data.data);
        } else if (Array.isArray(data)) {
          
          setInventoryData(data);
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

    fetchInventoryData();
  }, []);

  
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(inventoryData);
      setPage(0);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = inventoryData.filter((item) => {
      return (
        (item.fruitName && item.fruitName.toLowerCase().includes(lowercasedSearch)) ||
        (item.locationName && item.locationName.toLowerCase().includes(lowercasedSearch)) ||
        (item.fruitId && item.fruitId.toString().includes(lowercasedSearch)) ||
        (item.locationId && item.locationId.toString().includes(lowercasedSearch)) ||
        (item.quantity && item.quantity.toString().includes(lowercasedSearch)) ||
        (item._id && item._id.toString().includes(lowercasedSearch))
      );
    });

    setFilteredData(filtered);
    setPage(0); 
  }, [searchTerm, inventoryData]);

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
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Inventory List</h1>
        <TextField
          placeholder="Search inventory..."
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
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
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
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  {searchTerm ? 'No matching inventory found' : 'No inventory data available'}
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