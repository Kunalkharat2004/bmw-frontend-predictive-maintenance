/**
 * Degradation Contributors Component
 * Shows the top factors contributing to vehicle degradation
 */
import React from 'react';
import { 
  Box, 
  Typography, 
  Chip
} from '@mui/material';
import { 
  TrendingDown, 
  WarningAmber,
  Lightbulb
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

const DegradationContributors = ({ contributors }) => {
  const { isDark } = useThemeMode();

  const colors = {
    cardBg: isDark ? 'rgba(22, 27, 34, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? 'rgba(255,255,255,0.9)' : '#0f172a',
    textSecondary: isDark ? 'rgba(255,255,255,0.5)' : '#64748b',
    textMuted: isDark ? 'rgba(255,255,255,0.4)' : '#94a3b8',
    warningBg: isDark ? 'rgba(249, 115, 22, 0.08)' : 'rgba(249, 115, 22, 0.06)',
    warningBorder: isDark ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.15)',
    infoBg: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.06)',
    infoBorder: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
  };

  if (!contributors || contributors.length === 0) {
    return null;
  }

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
        Degradation Factors
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {contributors.map((contributor, index) => (
          <Box 
            key={index}
            sx={{ 
              p: 2,
              borderRadius: 2,
              bgcolor: colors.warningBg,
              border: `1px solid ${colors.warningBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: 1.5, 
                bgcolor: 'rgba(249, 115, 22, 0.15)',
                display: 'flex'
              }}
            >
              <WarningAmber sx={{ fontSize: 18, color: '#f97316' }} />
            </Box>
            
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography 
                variant="body2" 
                sx={{ color: colors.textPrimary, fontWeight: 600, mb: 0.25 }}
                noWrap
              >
                {contributor.feature}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: colors.textMuted }}
              >
                Value: <strong style={{ color: '#f97316' }}>{contributor.value}</strong> • 
                Impact: <strong style={{ color: '#f97316' }}>{contributor.importance.toFixed(3)}</strong>
              </Typography>
            </Box>

            <Chip 
              label={`#${index + 1}`} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(249, 115, 22, 0.2)',
                color: '#f97316',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Insight Box */}
      <Box 
        sx={{ 
          p: 2,
          borderRadius: 2,
          bgcolor: colors.infoBg,
          border: `1px solid ${colors.infoBorder}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5
        }}
      >
        <Lightbulb sx={{ fontSize: 18, color: '#3b82f6', mt: 0.25 }} />
        <Box>
          <Typography 
            variant="caption" 
            sx={{ color: '#3b82f6', fontWeight: 700, display: 'block', mb: 0.5 }}
          >
            Engineering Insight
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ color: colors.textMuted, lineHeight: 1.5 }}
          >
            These components show elevated stress and may contribute to future 
            degradation if left unaddressed.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DegradationContributors;
