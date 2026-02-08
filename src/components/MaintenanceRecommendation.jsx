/**
 * Maintenance Recommendation Component
 * Displays AI-powered maintenance decision per severity
 */
import React from 'react';
import { 
  Box,
  Typography,
  Button
} from '@mui/material';
import { 
  CheckCircle, 
  Info, 
  Warning, 
  Error,
  ArrowForward
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

const MaintenanceRecommendation = ({ decision }) => {
  const { isDark } = useThemeMode();

  if (!decision) {
    return null;
  }

  const getSeverityConfig = (level) => {
    const opacity = isDark ? 0.1 : 0.08;
    const borderOpacity = isDark ? 0.3 : 0.2;

    switch(level) {
      case 'normal':
        return { 
          color: '#22c55e',
          bg: `rgba(34, 197, 94, ${opacity})`,
          border: `rgba(34, 197, 94, ${borderOpacity})`,
          icon: CheckCircle,
          title: 'Systems Normal'
        };
      case 'soon':
        return { 
          color: '#3b82f6',
          bg: `rgba(59, 130, 246, ${opacity})`,
          border: `rgba(59, 130, 246, ${borderOpacity})`,
          icon: Info,
          title: 'Maintenance Soon'
        };
      case 'warning':
        return { 
          color: '#f97316',
          bg: `rgba(249, 115, 22, ${opacity})`,
          border: `rgba(249, 115, 22, ${borderOpacity})`,
          icon: Warning,
          title: 'Attention Required'
        };
      case 'immediate':
      case 'critical':
        return { 
          color: '#ef4444',
          bg: `rgba(239, 68, 68, ${opacity})`,
          border: `rgba(239, 68, 68, ${borderOpacity})`,
          icon: Error,
          title: 'CRITICAL'
        };
      default:
        return { 
          color: '#3b82f6',
          bg: `rgba(59, 130, 246, ${opacity})`,
          border: `rgba(59, 130, 246, ${borderOpacity})`,
          icon: Info,
          title: 'Recommendation'
        };
    }
  };

  const config = getSeverityConfig(decision.level);
  const Icon = config.icon;

  const textColors = {
    primary: isDark ? '#ffffff' : '#0f172a',
    secondary: isDark ? 'rgba(255,255,255,0.6)' : '#475569',
  };

  return (
    <Box 
      sx={{ 
        p: 3,
        borderRadius: 3,
        bgcolor: config.bg,
        border: `1px solid ${config.border}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      {/* Accent Line */}
      <Box 
        sx={{ 
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: config.color,
          borderRadius: '4px 0 0 4px'
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, pl: 1 }}>
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: `${config.color}20`,
            display: 'flex'
          }}
        >
          <Icon sx={{ fontSize: 28, color: config.color }} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: config.color, 
              fontWeight: 700, 
              letterSpacing: 1.5,
              fontSize: '0.7rem'
            }}
          >
            {config.title}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ color: textColors.primary, fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}
          >
            {decision.message}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: textColors.secondary, lineHeight: 1.6 }}
          >
            {decision.description}
          </Typography>

          {(decision.level === 'warning' || decision.level === 'immediate' || decision.level === 'critical') && (
            <Button 
              variant="contained"
              size="small"
              endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
              sx={{ 
                mt: 2,
                bgcolor: config.color,
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 2,
                '&:hover': {
                  bgcolor: config.color,
                  filter: 'brightness(1.1)'
                }
              }}
            >
              Schedule Service
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MaintenanceRecommendation;
