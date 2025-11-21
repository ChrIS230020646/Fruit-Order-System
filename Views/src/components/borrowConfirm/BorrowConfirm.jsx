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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { 
  Chip, 
  Box, 
  CircularProgress, 
  Alert, 
  TextField,
  InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GetApi from '../GetAPI/Getapi';

const api = GetApi.api + "/borrows";
const getUpdateApi = (id) => `${GetApi.api}/borrows/update/${id}`;

const columns = [ 
  { id: '_id', label: 'ID', minWidth: 50 },
  { id: 'fromShopId', label: 'From Shop', minWidth: 100 },
  { id: 'toShopId', label: 'To Shop', minWidth: 100 },
  { id: 'fruitId', label: 'Fruit ID', minWidth: 80 },
  { id: 'quantity', label: 'Quantity', minWidth: 80, align: 'right' },
  {
    id: 'borrowDate',
    label: 'Borrow Date',
    minWidth: 120,
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    id: 'returnDate',
    label: 'Return Date',
    minWidth: 120,
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 150,
    align: 'center',
  },
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataRows, setDataRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(api);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          setDataRows(result.data);
          setFilteredRows(result.data);
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRows(dataRows);
      setPage(0);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = dataRows.filter(row => 
        columns.some(column => {
          const value = row[column.id];
          if (value == null) return false;
          
          
          if (column.id === 'status') {
            const statusText = getStatusText(value).toLowerCase();
            return statusText.includes(lowercasedSearch);
          }
          
          
          if (column.format && typeof column.format === 'function') {
            const formattedValue = column.format(value).toLowerCase();
            return formattedValue.includes(lowercasedSearch);
          }
          
          
          return value.toString().toLowerCase().includes(lowercasedSearch);
        })
      );
      setFilteredRows(filtered);
      setPage(0); 
    }
  }, [searchTerm, dataRows]);

  const getStatusText = (status) => {
    const statusConfig = {
      'true': 'Confirmed',
      'false': 'Pending',
      'pending': 'Pending',
      'confirmed': 'Confirmed'
    };
    return statusConfig[status] || status;
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleConfirm = async (rowId) => {
    try {
      const updateUrl = getUpdateApi(rowId);
      console.log('Updating URL:', updateUrl);
      
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'true' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Update response:', result);

      
      setDataRows(prevRows => 
        prevRows.map(row => 
          row._id === rowId 
            ? { ...row, status: 'true' }
            : row
        )
      );
      
      console.log(`Confirmed: ${rowId}`);
      setError(null);
    } catch (err) {
      console.error('Error confirming borrow:', err);
      setError(`Failed to confirm borrow: ${err.message}`);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'true': { color: 'success', label: 'Confirmed' },
      'false': { color: 'warning', label: 'Pending' },
      'pending': { color: 'warning', label: 'Pending' },
      'confirmed': { color: 'success', label: 'Confirmed' }
    };
    
    const config = statusConfig[status] || { color: 'default', label: status };
    
    return (
      <Chip 
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const needsConfirmation = (status) => {
    return status === 'false' || status === 'pending' || !status;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <h1>Borrow List</h1>
        
        {/* 搜索栏 */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search borrow records..."
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
              label={`Total: ${dataRows.length}`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={`Filtered: ${filteredRows.length}`} 
              color={filteredRows.length !== dataRows.length ? "secondary" : "default"}
              variant="outlined" 
            />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
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
            {filteredRows.length > 0 ? (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        
                        if (column.id === 'status') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {getStatusChip(row.status)}
                            </TableCell>
                          );
                        }
                        
                        if (column.id === 'actions') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {needsConfirmation(row.status) ? (
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleConfirm(row._id)}
                                  sx={{
                                    textTransform: 'none',
                                    minWidth: '100px'
                                  }}
                                >
                                  Confirm
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  disabled
                                  sx={{
                                    textTransform: 'none',
                                    minWidth: '100px'
                                  }}
                                >
                                  Confirmed
                                </Button>
                              )}
                            </TableCell>
                          );
                        }
                        
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && value
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
                <TableCell colSpan={columns.length} align="center">
                  {searchTerm ? 'No matching records found' : 'No data available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}