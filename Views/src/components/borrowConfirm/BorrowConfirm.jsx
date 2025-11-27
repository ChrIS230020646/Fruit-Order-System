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
  InputAdornment,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GetApi from '../GetAPI/Getapi';

const api = GetApi.api + "/borrows";
const getUpdateApi = (id) => `${GetApi.api}/borrows/${id}`;

const columns = [ 
  { id: '_id', label: 'ID', minWidth: 50 },
  { id: 'fromShopId', label: 'From Shop', minWidth: 80 },
  { id: 'toShopId', label: 'To Shop', minWidth: 80 },
  { id: 'fruitId', label: 'Fruit ID', minWidth: 70 },
  { id: 'quantity', label: 'Quantity', minWidth: 70, align: 'right' },
  {
    id: 'borrowDate',
    label: 'Borrow Date',
    minWidth: 100,
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    id: 'returnDate',
    label: 'Return Date',
    minWidth: 100,
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 90,
    align: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
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

          const sortedData = result.data.sort((a, b) => {
            const idA = Number(a._id) || 0;
            const idB = Number(b._id) || 0;
            return idA - idB;
          });
          setDataRows(sortedData);
          setFilteredRows(sortedData);
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
    let filtered;
    if (searchTerm.trim() === '') {
      filtered = dataRows;
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = dataRows.filter(row => 
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
    }

    filtered = filtered.sort((a, b) => {
      const idA = Number(a._id) || 0;
      const idB = Number(b._id) || 0;
      return idA - idB;
    });
    
    setFilteredRows(filtered);
    setPage(0); 
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
    <Box sx={{ 
      maxWidth: 1400,
      margin: '0 auto',
      width: '100%',
      px: { xs: 1, sm: 2, md: 3 },
      overflow: 'visible',
    }}>
      <Paper sx={{ 
        width: '100%', 
        maxWidth: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
      }}>
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
          Borrow List
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
          View and manage all borrow requests
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search borrow records..."
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
              minWidth: 250,
              flexGrow: 1,
              maxWidth: 400,
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
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      
      <TableContainer sx={{ 
        maxHeight: 600,
        width: 'calc(100% - 48px)',
        overflowX: 'auto',
        overflowY: 'auto',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        mx: 3,
        mb: 3,
        maxWidth: 'calc(100% - 48px)',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}>
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 900 }}>
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
                                    minWidth: '90px',
                                    borderRadius: 2,
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
                                    minWidth: '90px',
                                    borderRadius: 2,
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
    </Box>
  );
}