import { createTheme } from '@mui/material/styles';

const techColors = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#8b5cf6',
    light: '#a78bfa',
    dark: '#7c3aed',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    contrastText: '#ffffff',
  },
  info: {
    main: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    ...techColors,
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      tech: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: (theme) => theme.palette.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: (theme) => theme.palette.text.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: (theme) => theme.palette.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: (theme) => theme.palette.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: (theme) => theme.palette.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: (theme) => theme.palette.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: (theme) => theme.palette.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: (theme) => theme.palette.text.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.05)',
    '0 4px 6px rgba(0,0,0,0.07)',
    '0 10px 15px rgba(0,0,0,0.1)',
    '0 20px 25px rgba(0,0,0,0.1)',
    '0 25px 50px rgba(0,0,0,0.15)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
        elevation3: {
          boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: (theme) => theme.palette.background.paper,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
            },
            '& .MuiOutlinedInput-input': {
              color: (theme) => theme.palette.text.primary,
            },
          },
          '& .MuiInputLabel-root': {
            color: (theme) => theme.palette.text.secondary,
            '&.Mui-focused': {
              color: (theme) => theme.palette.primary.main,
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: (theme) => theme.palette.background.paper,
            '& .MuiOutlinedInput-input': {
              color: (theme) => theme.palette.text.primary,
            },
          },
          '& .MuiInputLabel-root': {
            color: (theme) => theme.palette.text.secondary,
            '&.Mui-focused': {
              color: (theme) => theme.palette.primary.main,
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' 
              ? '#1a202c' 
              : '#f8fafc',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: (theme) => theme.palette.mode === 'dark' 
              ? '#ffffff' 
              : theme.palette.text.primary,
            borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : '#f8fafc',
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          padding: '16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: (theme) => theme.palette.text.primary,
        },
      },
    },
  },
});

export default theme;
