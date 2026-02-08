/**
 * Component Health Display
 * Shows health status breakdown by component
 */
import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress,
  Skeleton
} from '@mui/material';
import { 
  BatteryFull, 
  Thermostat, 
  Settings, 
  Speed, 
  TrendingDown
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

const ComponentHealth = ({ componentHealth }) => {
  const { isDark } = useThemeMode();

  const colors = {
    cardBg: isDark ? 'rgba(22, 27, 34, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? 'rgba(255,255,255,0.9)' : '#0f172a',
    textSecondary: isDark ? 'rgba(255,255,255,0.5)' : '#64748b',
    progressBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
  };

  if (!componentHealth) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          bgcolor: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`
        }}
      >
        <Skeleton variant="text" width="50%" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)', mb: 2 }} />
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton 
            key={i} 
            variant="rectangular" 
            height={50} 
            sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)', borderRadius: 2, mb: 1.5 }} 
          />
        ))}
      </Box>
    );
  }

  const getComponentIcon = (name) => {
    const icons = {
      'Battery System': BatteryFull,
      'Thermal System': Thermostat,
      'Motor System': Settings,
      'Braking System': Speed,
      'Usage Stress': TrendingDown
    };
    return icons[name] || Settings;
  };

  const getStatusConfig = (status, score) => {
    if (status === 'critical' || score < 40) {
      return { 
        color: '#ef4444', 
        bg: `rgba(239, 68, 68, ${isDark ? 0.1 : 0.08})`, 
        border: `rgba(239, 68, 68, ${isDark ? 0.2 : 0.15})` 
      };
    }
    if (status === 'degrading' || score < 70) {
      return { 
        color: '#f97316', 
        bg: `rgba(249, 115, 22, ${isDark ? 0.1 : 0.08})`, 
        border: `rgba(249, 115, 22, ${isDark ? 0.2 : 0.15})` 
      };
    }
    return { 
      color: '#22c55e', 
      bg: `rgba(34, 197, 94, ${isDark ? 0.1 : 0.08})`, 
      border: `rgba(34, 197, 94, ${isDark ? 0.2 : 0.15})` 
    };
  };

  return (
    <Box 
      sx={{ 
        p: 3, 
        borderRadius: 3, 
        bgcolor: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <Typography 
        variant="overline" 
        sx={{ 
          color: colors.textSecondary, 
          letterSpacing: 2, 
          fontWeight: 700,
          display: 'block',
          mb: 2.5
        }}
      >
        Component Health
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {Object.entries(componentHealth).map(([name, data]) => {
          const Icon = getComponentIcon(name);
          const config = getStatusConfig(data.status, data.score);
          
          return (
            <Box 
              key={name}
              sx={{ 
                p: 2,
                borderRadius: 2,
                bgcolor: config.bg,
                border: `1px solid ${config.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: 1.5, 
                  bgcolor: `${config.color}20`,
                  display: 'flex'
                }}
              >
                <Icon sx={{ fontSize: 20, color: config.color }} />
              </Box>
              
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ color: colors.textPrimary, fontWeight: 600 }}
                    noWrap
                  >
                    {name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: config.color, fontWeight: 700 }}
                  >
                    {data.score}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={data.score}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: colors.progressBg,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: config.color,
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ComponentHealth;
