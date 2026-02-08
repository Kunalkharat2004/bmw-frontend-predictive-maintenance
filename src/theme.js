import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a1929', // Deep Navy Blue
      light: '#1e3a5f',
      dark: '#000018',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00acc1', // Cyan/Teal accent
      light: '#5ddef4',
      dark: '#007c91',
      contrastText: '#000000',
    },
    background: {
      default: '#f4f6f8', // Light gray background for dashboard
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
    info: {
      main: '#0288d1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#0a1929',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#0a1929',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#0a1929',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#0a1929',
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#0a1929',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#0a1929',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1e3a5f',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
