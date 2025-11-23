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
import DeleteIcon from '@mui/icons-material/Delete';
import GetApi from '../GetAPI/Getapi';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Snackbar,
  Alert,
  Box,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { 
    id: '_id', 
    label: 'Delivery ID', 
    minWidth: 100,
    align: 'center'
  },
  { 
    id: 'fruitName', 
    label: 'Fruit Name', 
    minWidth: 100,
    align: 'left'
  },
  { 
    id: 'fromWarehouseId', 
    label: 'From Warehouse', 
    minWidth: 150,
    align: 'center'
  },
  { 
    id: 'toLocationId', 
    label: 'To Location', 
    minWidth: 150,
    align: 'center'
  },
  { 
    id: 'quantity', 
    label: 'Quantity', 
    minWidth: 100,
    align: 'center'
  },
  {
    id: 'deliveryDate',
    label: 'Delivery Date',
    minWidth: 150,
    align: 'center',
    format: (value) => new Date(value).toLocaleDateString()
  },
  {
    id: 'estimatedArrivalDate',
    label: 'Estimated Arrival',
    minWidth: 150,
    align: 'center',
    format: (value) => new Date(value).toLocaleDateString()
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 120,
    align: 'center'
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 150,
    align: 'center'
  }
];

export default function DeliveriesTable({ onEditDelivery, onDeliveryDeleted }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    delivery: null
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    fetchData();
  }, []);

  
  const applySearch = React.useCallback(() => {
    if (!searchTerm) {
      setFilteredRows(rows);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = rows.filter(row => 
      (row.fruitName && row.fruitName.toLowerCase().includes(term)) ||
      (row.fromWarehouseId && row.fromWarehouseId.toString().toLowerCase().includes(term)) ||
      (row.toLocationId && row.toLocationId.toString().toLowerCase().includes(term)) ||
      (row._id && row._id.toString().toLowerCase().includes(term)) ||
      (row.status && row.status.toLowerCase().includes(term))
    );

    setFilteredRows(filtered);
    setPage(0); 
  }, [searchTerm, rows]);

  React.useEffect(() => {
    applySearch();
  }, [applySearch]); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${GetApi.api}/deliveries/list`);
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data)) {
        
        const processedData = result.data.map(item => {
          
          if (item.$__) {
            return {
              ...item._doc,
              fruitName: item.fruitName 
            };
          }
          return item;
        });
        
        setRows(processedData);
      } else {
        console.error('Invalid data format:', result);
        setRows([]);
      }
    } catch (error) {
      console.error('Error fetching delivery data:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
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

  const handleEditClick = (row) => {
    if (onEditDelivery) {
      onEditDelivery(row);
    } else {
      console.log('Edit clicked for:', row);
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({
      open: true,
      delivery: row
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.delivery) return;

    try {
      const response = await fetch(`${GetApi.api}/deliveries/delete/${deleteDialog.delivery._id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Delivery deleted successfully!',
          severity: 'success'
        });
        
        
        setRows(prevRows => prevRows.filter(row => row._id !== deleteDialog.delivery._id));
        
        
        if (onDeliveryDeleted) {
          onDeliveryDeleted(deleteDialog.delivery._id);
        }
      } else {
        throw new Error(result.message || result.error || 'Failed to delete delivery');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete delivery',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, delivery: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, delivery: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  
  const getStatusStyle = (status) => {
    const style = {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    };

    // Use theme-aware colors for dark mode
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = document.documentElement.getAttribute('data-toolpad-color-scheme') === 'dark' || isDark;
    
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { 
          ...style, 
          backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.2)' : '#e8f5e8', 
          color: darkMode ? '#34d399' : '#2e7d32' 
        };
      case 'in transit':
        return { 
          ...style, 
          backgroundColor: darkMode ? 'rgba(6, 182, 212, 0.2)' : '#e3f2fd', 
          color: darkMode ? '#22d3ee' : '#1565c0' 
        };
      case 'pending':
        return { 
          ...style, 
          backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.2)' : '#fff3e0', 
          color: darkMode ? '#fbbf24' : '#ef6c00' 
        };
      case 'cancelled':
        return { 
          ...style, 
          backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#ffebee', 
          color: darkMode ? '#f87171' : '#c62828' 
        };
      default:
        return { 
          ...style, 
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5', 
          color: darkMode ? '#9ca3af' : '#757575' 
        };
    }
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
          Deliveries Information
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={40} />
        </Box>
      </Paper>
    );
  }

  return (
    <>
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
            Deliveries Information
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            Track and manage all delivery records
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          
          <TextField
            fullWidth
            size="small"
            placeholder="Search deliveries by fruit name, location, ID, or status..."
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
        </Box>

        <TableContainer sx={{ 
          maxHeight: 600,
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          mx: 3,
          mb: 3,
        }}>
          <Table stickyHeader aria-label="sticky table">
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
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    {rows.length === 0 ? 'No delivery records found' : 'No deliveries match your search'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          
                          if (column.id === 'actions') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
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
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteClick(row)}
                                    sx={{
                                      textTransform: 'none',
                                      minWidth: '80px',
                                      borderRadius: 2,
                                      '&:hover': {
                                        backgroundColor: 'error.main',
                                        color: 'white',
                                      },
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </TableCell>
                            );
                          }
                          
                          if (column.id === 'status') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span style={getStatusStyle(value)}>
                                  {value || 'Unknown'}
                                </span>
                              </TableCell>
                            );
                          }
                          
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && value
                                ? column.format(value)
                                : value || '-'}
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
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this delivery record? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}