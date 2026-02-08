/**
 * Degradation Contributors Component
 * Shows the top factors contributing to vehicle degradation
 * Features AI-powered insights displayed as professional cards
 */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Collapse,
  Card
} from '@mui/material';
import { 
  WarningAmber,
  AutoAwesome,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Error as CriticalIcon,
  Info as InfoIcon,
  Lightbulb as TipIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { getAIInsights } from '../services/api';

const DegradationContributors = ({ contributors, kpis, componentHealth }) => {
  const { isDark } = useThemeMode();
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const colors = {
    cardBg: isDark ? 'rgba(22, 27, 34, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? 'rgba(255,255,255,0.9)' : '#0f172a',
    textSecondary: isDark ? 'rgba(255,255,255,0.5)' : '#64748b',
    textMuted: isDark ? 'rgba(255,255,255,0.4)' : '#94a3b8',
    warningBg: isDark ? 'rgba(249, 115, 22, 0.08)' : 'rgba(249, 115, 22, 0.06)',
    warningBorder: isDark ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.15)',
    aiBg: isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)',
    aiBorder: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)',
    aiAccent: '#8b5cf6',
  };

  // Card type configurations
  const cardTypes = {
    critical: {
      icon: CriticalIcon,
      color: '#ef4444',
      bg: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
      border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)'
    },
    warning: {
      icon: WarningAmber,
      color: '#f97316',
      bg: isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.08)',
      border: isDark ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.25)'
    },
    info: {
      icon: InfoIcon,
      color: '#3b82f6',
      bg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
      border: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'
    },
    tip: {
      icon: TipIcon,
      color: '#22c55e',
      bg: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)',
      border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)'
    }
  };

  // Parse AI insights from JSON string
  const parseInsights = (insightsStr) => {
    try {
      // Try to extract JSON from the response
      let jsonStr = insightsStr;
      
      // Remove markdown code blocks if present
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }
      
      // Trim whitespace
      jsonStr = jsonStr.trim();
      
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      console.error('Failed to parse AI insights:', e);
      return null;
    }
  };

  // Fetch AI insights
  const fetchAIInsights = useCallback(async () => {
    if (!contributors || contributors.length === 0) return;
    
    setLoadingInsights(true);
    setInsightsError(null);
    
    try {
      const result = await getAIInsights(contributors, kpis, componentHealth);
      if (result.success && result.insights) {
        setAiInsights(result.insights);
      } else {
        setInsightsError(result.message || 'Failed to generate insights');
      }
    } catch (err) {
      console.error('AI insights error:', err);
      setInsightsError(err.message || 'Failed to fetch AI insights');
    } finally {
      setLoadingInsights(false);
    }
  }, [contributors, kpis, componentHealth]);

  // Auto-fetch insights when contributors change
  useEffect(() => {
    if (contributors && contributors.length > 0) {
      fetchAIInsights();
    }
  }, [contributors]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!contributors || contributors.length === 0) {
    return null;
  }

  // Parse insights for card display
  const insightCards = aiInsights ? parseInsights(aiInsights) : null;

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

      {/* AI-Powered Insights Box - Collapsible */}
      <Box 
        sx={{ 
          borderRadius: 2,
          bgcolor: colors.aiBg,
          border: `1px solid ${colors.aiBorder}`,
          overflow: 'hidden'
        }}
      >
        {/* Header - Clickable */}
        <Box 
          onClick={handleToggleExpand}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            p: 2,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            '&:hover': {
              bgcolor: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
            }
          }}
        >
          <Box
            sx={{
              p: 0.75,
              borderRadius: 1.5,
              bgcolor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex'
            }}
          >
            <AutoAwesome sx={{ fontSize: 18, color: colors.aiAccent }} />
          </Box>
          <Typography 
            variant="subtitle2" 
            sx={{ color: colors.aiAccent, fontWeight: 700, flexGrow: 1 }}
          >
            AI-Powered Analysis
          </Typography>
          <Tooltip title="Refresh insights">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                fetchAIInsights();
              }}
              disabled={loadingInsights}
              sx={{ 
                color: colors.aiAccent,
                '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.1)' }
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <IconButton 
            size="small"
            sx={{ 
              color: colors.aiAccent,
              p: 0.5
            }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Content - Collapsible */}
        <Collapse in={isExpanded}>
          <Box sx={{ px: 2, pb: 2 }}>
            {loadingInsights ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                <CircularProgress size={20} sx={{ color: colors.aiAccent }} />
                <Typography variant="body2" sx={{ color: colors.textMuted }}>
                  Generating AI insights...
                </Typography>
              </Box>
            ) : insightsError ? (
              <Typography 
                variant="body2" 
                sx={{ color: colors.textMuted, fontStyle: 'italic', py: 1 }}
              >
                {insightsError}
              </Typography>
            ) : insightCards && insightCards.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {insightCards.map((card, index) => {
                  const typeConfig = cardTypes[card.type] || cardTypes.info;
                  const IconComponent = typeConfig.icon;
                  
                  return (
                    <Card
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: typeConfig.bg,
                        border: `1px solid ${typeConfig.border}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${typeConfig.border}`
                        }
                      }}
                    >
                      <Box
                        sx={{
                          p: 0.75,
                          borderRadius: 1.5,
                          bgcolor: `${typeConfig.color}20`,
                          display: 'flex',
                          flexShrink: 0
                        }}
                      >
                        <IconComponent sx={{ fontSize: 18, color: typeConfig.color }} />
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: typeConfig.color,
                            fontWeight: 700,
                            mb: 0.5,
                            fontSize: '0.85rem'
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.textPrimary,
                            lineHeight: 1.6,
                            fontSize: '0.8rem'
                          }}
                        >
                          {card.description}
                        </Typography>
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            ) : aiInsights ? (
              // Fallback to plain text if parsing failed
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.textPrimary, 
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {aiInsights}
              </Typography>
            ) : (
              <Typography 
                variant="body2" 
                sx={{ color: colors.textMuted, fontStyle: 'italic' }}
              >
                Click refresh to generate AI-powered insights.
              </Typography>
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default DegradationContributors;
