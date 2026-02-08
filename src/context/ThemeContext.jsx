import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme Context
const ThemeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
});

// Custom hook to use theme
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

// Theme configurations
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          // Dark mode colors
          primary: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
          },
          secondary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
          },
          background: {
            default: '#0d1117',
            paper: '#161b22',
            sidebar: 'rgba(22, 27, 34, 0.98)',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.4)',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
          action: {
            hover: 'rgba(255, 255, 255, 0.05)',
            selected: 'rgba(255, 255, 255, 0.08)',
          },
          success: { main: '#22c55e', light: 'rgba(34, 197, 94, 0.1)' },
          warning: { main: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
          error: { main: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
          info: { main: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' },
        }
      : {
          // Light mode colors
          primary: {
            main: '#2563eb',
            light: '#3b82f6',
            dark: '#1d4ed8',
          },
          secondary: {
            main: '#7c3aed',
            light: '#8b5cf6',
            dark: '#6d28d9',
          },
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
            sidebar: '#ffffff',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
            disabled: '#94a3b8',
          },
          divider: 'rgba(0, 0, 0, 0.08)',
          action: {
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(0, 0, 0, 0.08)',
          },
          success: { main: '#16a34a', light: 'rgba(22, 163, 74, 0.1)' },
          warning: { main: '#ea580c', light: 'rgba(234, 88, 12, 0.1)' },
          error: { main: '#dc2626', light: 'rgba(220, 38, 38, 0.1)' },
          info: { main: '#2563eb', light: 'rgba(37, 99, 235, 0.1)' },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
            borderRadius: 4,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Get initial mode from localStorage or default to 'dark'
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode');
      return savedMode || 'dark';
    }
    return 'dark';
  });

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      isDark: mode === 'dark',
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
