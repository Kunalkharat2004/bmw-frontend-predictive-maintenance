/**
 * Main Dashboard Component
 * Orchestrates the vehicle health monitoring interface
 * Fully responsive across all devices
 */
import React, { useState, useCallback, useMemo, memo } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert,
  Paper,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  SwipeableDrawer
} from '@mui/material';
import { 
  DirectionsCar as CarIcon, 
  Analytics as AnalyticsIcon,
  PlayArrow as PlayIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Tune as TuneIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import { useThemeMode } from '../context/ThemeContext';
import TelemetryForm from './TelemetryForm';
import KPICards from './KPICards';
import ComponentHealth from './ComponentHealth';
import DegradationContributors from './DegradationContributors';
import MaintenanceRecommendation from './MaintenanceRecommendation';
import { predictVehicleHealth } from '../services/api';
import { FEATURE_DEFINITIONS, convertToFeatures } from '../utils/helpers';

const SIDEBAR_WIDTH = 440;

// Memoized Sidebar Content component
const SidebarContent = memo(({ 
  telemetryValues, 
  onTelemetryChange, 
  onAnalyze, 
  loading, 
  isMobile, 
  onClose,
  colors,
  isDark
}) => (
  <Box 
    sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: isMobile ? '100%' : 'calc(100vh - 72px)',
      bgcolor: colors.sidebarBg,
    }}
  >
    {/* Sidebar Header */}
    <Box sx={{ 
      p: 2.5, 
      borderBottom: `1px solid ${colors.sidebarBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box>
        <Typography variant="subtitle1" fontWeight="700" color={colors.textPrimary} sx={{ mb: 0.5 }}>
          Telemetry Configuration
        </Typography>
        <Typography variant="caption" color={colors.textSecondary}>
          Adjust vehicle parameters for analysis
        </Typography>
      </Box>
      {isMobile && (
        <IconButton onClick={onClose} sx={{ color: colors.textSecondary }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
    
    {/* Scrollable Form Area */}
    <Box 
      sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 2,
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { 
          bgcolor: colors.scrollThumb, 
          borderRadius: 3,
          '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)' }
        }
      }}
    >
      <TelemetryForm
        values={telemetryValues}
        onChange={onTelemetryChange}
      />
    </Box>

    {/* Analyze Button */}
    <Box sx={{ p: 2, borderTop: `1px solid ${colors.sidebarBorder}` }}>
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onAnalyze}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
        sx={{ 
          py: 1.5,
          fontWeight: 700,
          fontSize: '0.95rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
          },
          '&:disabled': {
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
          }
        }}
      >
        {loading ? 'Analyzing...' : 'Run Analysis'}
      </Button>
    </Box>
  </Box>
));

SidebarContent.displayName = 'SidebarContent';

const Dashboard = () => {
  const theme = useTheme();
  const { toggleTheme, isDark } = useThemeMode();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [telemetryValues, setTelemetryValues] = useState(() => {
    const defaults = {};
    FEATURE_DEFINITIONS.forEach(f => {
      defaults[f.id] = f.default;
    });
    return defaults;
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized handlers to prevent unnecessary re-renders
  const handleTelemetryChange = useCallback((updater) => {
    if (typeof updater === 'function') {
      setTelemetryValues(updater);
    } else {
      setTelemetryValues(updater);
    }
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleOpenDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Close drawer on mobile after clicking analyze
    if (isMobile) {
      setDrawerOpen(false);
    }

    try {
      const features = convertToFeatures(telemetryValues);
      const result = await predictVehicleHealth(features);
      
      if (result.success) {
        setPrediction(result.data);
      } else {
        setError('Failed to get prediction. Please try again.');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'An error occurred while analyzing vehicle health.');
    } finally {
      setLoading(false);
    }
  }, [telemetryValues, isMobile]);

  // Memoized dynamic colors based on theme
  const colors = useMemo(() => ({
    headerBg: isDark ? 'rgba(13, 17, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    headerBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    sidebarBg: isDark ? 'rgba(22, 27, 34, 0.98)' : '#ffffff',
    sidebarBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    contentBg: isDark ? '#0d1117' : '#f8fafc',
    cardBg: isDark ? 'rgba(22, 27, 34, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    textPrimary: isDark ? '#ffffff' : '#0f172a',
    textSecondary: isDark ? 'rgba(255,255,255,0.5)' : '#64748b',
    scrollThumb: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
    emptyStateBg: isDark ? 'rgba(22, 27, 34, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    emptyStateBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  }), [isDark]);

  // Sidebar width based on screen size
  const sidebarWidth = useMemo(() => {
    if (isMobile) return '100%';
    if (isTablet) return 380;
    return SIDEBAR_WIDTH;
  }, [isMobile, isTablet]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.contentBg }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: colors.headerBg,
          borderBottom: `1px solid ${colors.headerBorder}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 3 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton 
              onClick={handleOpenDrawer}
              sx={{ 
                mr: 1.5,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                color: colors.textPrimary
              }}
            >
              <TuneIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex'
              }}
            >
              <CarIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'white' }} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" fontWeight="700" color={colors.textPrimary} letterSpacing="-0.5px">
                Vehicle Health Monitor
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Predictive Maintenance System
              </Typography>
            </Box>
            {/* Mobile: Short title */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Typography variant="subtitle1" fontWeight="700" color={colors.textPrimary}>
                Vehicle Health
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Hide chips on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Chip 
                icon={<MemoryIcon sx={{ fontSize: 16 }} />}
                label="LSTM + Autoencoder"
                size="small"
                sx={{ 
                  bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
              <Chip 
                icon={<SpeedIcon sx={{ fontSize: 16 }} />}
                label="Real-time"
                size="small"
                sx={{ 
                  bgcolor: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                  color: isDark ? '#4ade80' : '#16a34a',
                  border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
            </Box>

            {/* Theme Toggle Button */}
            <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton 
                onClick={toggleTheme}
                sx={{ 
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  color: isDark ? '#f59e0b' : '#6366f1',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    transform: 'rotate(180deg)'
                  }
                }}
              >
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen && isMobile}
        onClose={handleCloseDrawer}
        onOpen={handleOpenDrawer}
        disableSwipeToOpen={false}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 400,
            bgcolor: colors.sidebarBg,
          }
        }}
      >
        <SidebarContent 
          telemetryValues={telemetryValues}
          onTelemetryChange={handleTelemetryChange}
          onAnalyze={handleAnalyze}
          loading={loading}
          isMobile={isMobile}
          onClose={handleCloseDrawer}
          colors={colors}
          isDark={isDark}
        />
      </SwipeableDrawer>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box 
            sx={{ 
              width: sidebarWidth, 
              flexShrink: 0,
              borderRight: `1px solid ${colors.sidebarBorder}`,
            }}
          >
            <SidebarContent 
              telemetryValues={telemetryValues}
              onTelemetryChange={handleTelemetryChange}
              onAnalyze={handleAnalyze}
              loading={loading}
              isMobile={false}
              onClose={handleCloseDrawer}
              colors={colors}
              isDark={isDark}
            />
          </Box>
        )}

        {/* Right Content - Results */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            height: { xs: 'auto', md: 'calc(100vh - 72px)' },
            minHeight: { xs: 'calc(100vh - 72px)', md: 'auto' },
            bgcolor: colors.contentBg,
            '&::-webkit-scrollbar': { width: 8 },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': { 
              bgcolor: colors.scrollThumb, 
              borderRadius: 4,
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)' }
            }
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Mobile: Floating Action Button hint */}
            {isMobile && !prediction && !loading && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
                  border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                  '& .MuiAlert-icon': { color: '#3b82f6' }
                }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleOpenDrawer}
                    sx={{ fontWeight: 600 }}
                  >
                    Open
                  </Button>
                }
              >
                Tap the <TuneIcon sx={{ fontSize: 16, mx: 0.5, verticalAlign: 'middle' }} /> button to configure telemetry parameters
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert 
                severity="error" 
                variant="filled" 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}

            {/* Empty State */}
            {!prediction && !loading && (
              <Fade in timeout={500}>
                <Paper 
                  sx={{ 
                    p: { xs: 4, sm: 6, md: 8 }, 
                    textAlign: 'center', 
                    borderRadius: { xs: 3, md: 4 },
                    bgcolor: colors.emptyStateBg,
                    border: `1px dashed ${colors.emptyStateBorder}`,
                    backdropFilter: 'blur(10px)'
                  }} 
                  elevation={0}
                >
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      p: { xs: 2, md: 3 }, 
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                      borderRadius: '50%', 
                      mb: 3,
                      border: '1px solid rgba(59,130,246,0.2)'
                    }}
                  >
                    <AnalyticsIcon sx={{ fontSize: { xs: 40, md: 56 }, color: '#3b82f6' }} />
                  </Box>
                  <Typography variant="h5" fontWeight="700" color={colors.textPrimary} gutterBottom>
                    Ready for Analysis
                  </Typography>
                  <Typography color={colors.textSecondary} maxWidth="400px" mx="auto" lineHeight={1.7}>
                    {isMobile 
                      ? 'Open the telemetry panel to configure parameters and run AI-powered diagnostics.'
                      : 'Configure vehicle telemetry parameters in the left panel and click Run Analysis to receive AI-powered diagnostics.'
                    }
                  </Typography>
                  
                  {/* Mobile: Quick action button */}
                  {isMobile && (
                    <Button
                      variant="contained"
                      startIcon={<TuneIcon />}
                      onClick={handleOpenDrawer}
                      sx={{ 
                        mt: 3,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        fontWeight: 600
                      }}
                    >
                      Configure Telemetry
                    </Button>
                  )}
                </Paper>
              </Fade>
            )}

            {/* Loading State */}
            {loading && (
              <Fade in timeout={300}>
                <Paper 
                  sx={{ 
                    p: { xs: 4, sm: 6, md: 8 }, 
                    textAlign: 'center', 
                    borderRadius: { xs: 3, md: 4 },
                    bgcolor: colors.cardBg,
                    border: `1px solid ${colors.sidebarBorder}`
                  }} 
                  elevation={0}
                >
                  <CircularProgress size={60} sx={{ color: '#3b82f6', mb: 3 }} />
                  <Typography variant="h6" fontWeight="600" color={colors.textPrimary} gutterBottom>
                    Analyzing Vehicle Health...
                  </Typography>
                  <Typography color={colors.textSecondary}>
                    Running LSTM predictions and anomaly detection
                  </Typography>
                </Paper>
              </Fade>
            )}

            {/* Results */}
            {prediction && !loading && (
              <Fade in timeout={500}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
                  {/* Section Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" fontWeight="700" color={colors.textPrimary}>
                        Analysis Results
                      </Typography>
                      <Chip 
                        label="Complete" 
                        size="small"
                        sx={{ 
                          bgcolor: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                          color: isDark ? '#4ade80' : '#16a34a',
                          fontWeight: 600 
                        }}
                      />
                    </Box>
                    
                    {/* Mobile: Re-configure button */}
                    {isMobile && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<TuneIcon />}
                        onClick={handleOpenDrawer}
                        sx={{ 
                          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                          color: colors.textPrimary,
                          fontWeight: 600
                        }}
                      >
                        Reconfigure
                      </Button>
                    )}
                  </Box>

                  {/* Maintenance Recommendation - Hero Card */}
                  <MaintenanceRecommendation
                    decision={prediction.maintenance_decision}
                  />

                  {/* KPI Section */}
                  <Box>
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        color: colors.textSecondary, 
                        letterSpacing: 2, 
                        fontWeight: 700,
                        display: 'block',
                        mb: 2
                      }}
                    >
                      Key Performance Indicators
                    </Typography>
                    <KPICards kpis={prediction.kpis} />
                  </Box>

                  {/* Two Column Layout for Health & Contributors */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
                    <ComponentHealth componentHealth={prediction.component_health} />
                    <DegradationContributors contributors={prediction.degradation_contributors} />
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
