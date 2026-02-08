/**
 * KPI Cards Component
 * Displays key performance indicators in a professional grid layout
 */
import React from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Skeleton
} from '@mui/material';
import { 
  Warning as WarningIcon,
  AccessTime as ClockIcon,
  Timeline as ActivityIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

const KPICards = ({ kpis }) => {
  const { isDark } = useThemeMode();

  if (!kpis) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map(i => (
          <Grid item xs={6} md={3} key={i}>
            <Skeleton 
              variant="rectangular" 
              height={120} 
              sx={{ borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} 
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  const getKPIConfig = (id, value) => {
    switch(id) {
      case 'failure':
        if (value >= 70) return { color: '#ef4444', bg: `rgba(239, 68, 68, ${isDark ? 0.1 : 0.08})`, border: `rgba(239, 68, 68, ${isDark ? 0.3 : 0.2})` };
        if (value >= 40) return { color: '#f97316', bg: `rgba(249, 115, 22, ${isDark ? 0.1 : 0.08})`, border: `rgba(249, 115, 22, ${isDark ? 0.3 : 0.2})` };
        return { color: '#22c55e', bg: `rgba(34, 197, 94, ${isDark ? 0.1 : 0.08})`, border: `rgba(34, 197, 94, ${isDark ? 0.3 : 0.2})` };
      case 'rul':
        if (value <= 30) return { color: '#ef4444', bg: `rgba(239, 68, 68, ${isDark ? 0.1 : 0.08})`, border: `rgba(239, 68, 68, ${isDark ? 0.3 : 0.2})` };
        if (value <= 60) return { color: '#f97316', bg: `rgba(249, 115, 22, ${isDark ? 0.1 : 0.08})`, border: `rgba(249, 115, 22, ${isDark ? 0.3 : 0.2})` };
        return { color: '#3b82f6', bg: `rgba(59, 130, 246, ${isDark ? 0.1 : 0.08})`, border: `rgba(59, 130, 246, ${isDark ? 0.3 : 0.2})` };
      case 'anomaly':
        if (value >= 0.5) return { color: '#ef4444', bg: `rgba(239, 68, 68, ${isDark ? 0.1 : 0.08})`, border: `rgba(239, 68, 68, ${isDark ? 0.3 : 0.2})` };
        if (value >= 0.1) return { color: '#f97316', bg: `rgba(249, 115, 22, ${isDark ? 0.1 : 0.08})`, border: `rgba(249, 115, 22, ${isDark ? 0.3 : 0.2})` };
        return { color: '#8b5cf6', bg: `rgba(139, 92, 246, ${isDark ? 0.1 : 0.08})`, border: `rgba(139, 92, 246, ${isDark ? 0.3 : 0.2})` };
      case 'health':
        if (value >= 80) return { color: '#22c55e', bg: `rgba(34, 197, 94, ${isDark ? 0.1 : 0.08})`, border: `rgba(34, 197, 94, ${isDark ? 0.3 : 0.2})` };
        if (value >= 50) return { color: '#f97316', bg: `rgba(249, 115, 22, ${isDark ? 0.1 : 0.08})`, border: `rgba(249, 115, 22, ${isDark ? 0.3 : 0.2})` };
        return { color: '#ef4444', bg: `rgba(239, 68, 68, ${isDark ? 0.1 : 0.08})`, border: `rgba(239, 68, 68, ${isDark ? 0.3 : 0.2})` };
      default:
        return { color: '#3b82f6', bg: `rgba(59, 130, 246, ${isDark ? 0.1 : 0.08})`, border: `rgba(59, 130, 246, ${isDark ? 0.3 : 0.2})` };
    }
  };

  const cards = [
    {
      id: 'failure',
      title: 'Failure Risk',
      value: kpis.failure_probability,
      unit: '%',
      icon: WarningIcon,
      displayValue: (v) => Math.round(v)
    },
    {
      id: 'rul',
      title: 'RUL',
      subtitle: 'Remaining Life',
      value: kpis.remaining_useful_life,
      unit: 'cycles',
      icon: ClockIcon,
      displayValue: (v) => Math.round(v)
    },
    {
      id: 'anomaly',
      title: 'Anomaly',
      subtitle: 'Detection Score',
      value: kpis.anomaly_score,
      unit: '',
      icon: ActivityIcon,
      displayValue: (v) => v.toFixed(4)
    },
    {
      id: 'health',
      title: 'Health Score',
      value: kpis.overall_health,
      unit: '%',
      icon: HeartIcon,
      displayValue: (v) => Math.round(v)
    }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => {
        const config = getKPIConfig(card.id, card.value);
        const Icon = card.icon;

        return (
          <Grid item xs={6} md={3} key={card.id}>
            <Box 
              sx={{ 
                p: { xs: 2, sm: 2.5 },
                borderRadius: { xs: 2, sm: 3 },
                bgcolor: config.bg,
                border: `1px solid ${config.border}`,
                height: '100%',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-2px)' },
                  boxShadow: { xs: 'none', sm: `0 8px 25px ${config.border}` }
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, sm: 2 } }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: { xs: '0.6rem', sm: '0.65rem' }
                  }}
                >
                  {card.title}
                </Typography>
                <Box 
                  sx={{ 
                    p: { xs: 0.5, sm: 0.75 }, 
                    borderRadius: 1.5, 
                    bgcolor: `${config.color}20`,
                    display: 'flex'
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 14, sm: 16 }, color: config.color }} />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography 
                  sx={{ 
                    fontWeight: 800, 
                    color: config.color,
                    lineHeight: 1,
                    letterSpacing: '-1px',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  {card.displayValue(card.value)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDark ? 'rgba(255,255,255,0.4)' : '#94a3b8', 
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {card.unit}
                </Typography>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default KPICards;
