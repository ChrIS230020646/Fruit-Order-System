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
  Chip,
  Typography,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { 
    id: '_id', 
    label: 'ID', 
    minWidth: 100,
    align: 'center'
  },
  { 
    id: 'name', 
    label: 'Fruit Name', 
    minWidth: 200,
    align: 'left'
  },
  { 
    id: 'originCountryName', 
    label: 'Country', 
    minWidth: 180,
    align: 'center'
  },
  { 
    id: 'originCountryId', 
    label: 'Country ID', 
    minWidth: 120,
    align: 'center'
  },
  {
    id: 'price',
    label: 'Price ($)',
    minWidth: 120,
    align: 'right',
    format: (value) => value.toFixed(2)
  },
  {
    id: 'imageURL',
    label: 'Image',
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

export default function StickyHeadTable({ onEditfruit, onFruitDeleted }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    fruit: null
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  
  React.useEffect(() => {
    fetchData();
  }, []);

  
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRows(rows);
      setPage(0);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = rows.filter(row => 
        columns.some(column => {
          const value = row[column.id];
          if (value == null) return false;
          
          
          if (column.id === 'actions') return false;
          
          
          if (column.id === 'price' && typeof value === 'number') {
            return value.toString().includes(lowercasedSearch);
          }
          
          
          if (column.id === 'imageURL') {
            return value.toLowerCase().includes(lowercasedSearch);
          }
          
          
          return value.toString().toLowerCase().includes(lowercasedSearch);
        })
      );
      setFilteredRows(filtered);
      setPage(0); 
    }
  }, [searchTerm, rows]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${GetApi.api}/fruits`);
      const result = await response.json();
      
      if (result.data && Array.isArray(result.data)) {
        
        const processedData = result.data.map(item => {
          
          if (item.$__) {
            return {
              ...item._doc, 
              originCountryName: item.originCountryName 
            };
          }
          return item;
        });
        
        setRows(processedData);
        setFilteredRows(processedData);
      } else {
        console.error('Invalid data format:', result);
        setRows([]);
        setFilteredRows([]);
      }
    } catch (error) {
      console.error('Error fetching fruit data:', error);
      setRows([]);
      setFilteredRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (row) => {
    if (onEditfruit) {
      onEditfruit(row);
    } else {
      console.log('Edit clicked for:', row);
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({
      open: true,
      fruit: row
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.fruit) return;

    try {
      const response = await fetch(`${GetApi.api}/fruits/delete/${deleteDialog.fruit._id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Fruit deleted successfully!',
          severity: 'success'
        });
        
        
        setRows(prevRows => prevRows.filter(row => row._id !== deleteDialog.fruit._id));
        
        
        if (onFruitDeleted) {
          onFruitDeleted(deleteDialog.fruit._id);
        }
      } else {
        throw new Error(result.message || result.error || 'Failed to delete fruit');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete fruit',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, fruit: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, fruit: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  
  const renderImageCell = (imageURL) => {
    if (!imageURL) return 'No Image';
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imageURL.endsWith('.jpg') || imageURL.endsWith('.png') || imageURL.startsWith('http') ? (
          <img 
            src={imageURL} 
            alt="fruit" 
            style={{ 
              width: '40px',
              height: '40px', 
              objectFit: 'cover',
              borderRadius: '4px'
            }} 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : null}
        <span style={{ fontSize: '12px', marginLeft: '8px' }}>
          {imageURL.length > 20 ? imageURL.substring(0, 20) + '...' : imageURL}
        </span>
      </div>
    );
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
          Fruit Information
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
            Fruit Information
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
            View and manage all fruit products
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 2,
            mb: 3 
          }}>
            <TextField
              placeholder="Search fruits by name, country, price..."
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
                label={`Total: ${rows.length}`} 
                color="primary" 
                variant="outlined" 
                sx={{ borderRadius: 2 }}
              />
              <Chip 
                label={`Filtered: ${filteredRows.length}`} 
                color={filteredRows.length !== rows.length ? "secondary" : "default"}
                variant="outlined" 
                sx={{ borderRadius: 2 }}
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
                      : '#f8fafc',
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
                          
                          if (column.id === 'imageURL') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {renderImageCell(value)}
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
                    {searchTerm ? 'No matching fruits found' : 'No data available'}
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
            Are you sure you want to delete the fruit "{deleteDialog.fruit?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            autoFocus
            sx={{ 
              borderRadius: 2,
              '&:hover': {
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              },
            }}
          >
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
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}