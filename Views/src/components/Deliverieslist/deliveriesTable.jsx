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
  InputAdornment
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

    switch (status?.toLowerCase()) {
      case 'delivered':
        return { ...style, backgroundColor: '#e8f5e8', color: '#2e7d32' };
      case 'in transit':
        return { ...style, backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'pending':
        return { ...style, backgroundColor: '#fff3e0', color: '#ef6c00' };
      case 'cancelled':
        return { ...style, backgroundColor: '#ffebee', color: '#c62828' };
      default:
        return { ...style, backgroundColor: '#f5f5f5', color: '#757575' };
    }
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', p: 3, textAlign: 'center' }}>
        <h1>Deliveries Information</h1>
        <div>Loading...</div>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <h1 style={{ margin: '0 0 16px 0' }}>Deliveries Information</h1>
          
          
          <TextField
            fullWidth
            size="small"
            placeholder="Search deliveries by fruit name, location, ID, or status..."
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
        </Box>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ 
                      minWidth: column.minWidth,
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5'
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
                                      minWidth: '80px'
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
                                      minWidth: '80px'
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