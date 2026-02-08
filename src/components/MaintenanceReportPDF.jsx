/**
 * MaintenanceReportPDF Component
 * Generates a professional PDF maintenance report using @react-pdf/renderer
 */
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet 
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  // Header
  header: {
    marginBottom: 25,
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    textDecoration: 'none',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    textDecoration: 'none',
  },
  generatedDate: {
    fontSize: 10,
    color: '#94a3b8',
    textDecoration: 'none',
  },
  // Section styles
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    backgroundColor: '#f1f5f9',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
    textDecoration: 'none',
  },
  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    width: '48%',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    textDecoration: 'none',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  kpiUnit: {
    fontSize: 10,
    color: '#64748b',
  },
  // Component Health
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 6,
    borderRadius: 4,
    backgroundColor: '#f8fafc',
  },
  componentName: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    fontWeight: 'medium',
    textDecoration: 'none',
  },
  componentScore: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    textDecoration: 'none',
  },
  progressBarBg: {
    width: 80,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  // Degradation
  degradationRow: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 6,
    borderRadius: 4,
    backgroundColor: '#fff7ed',
    borderLeft: '3px solid #f97316',
  },
  degradationRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  degradationContent: {
    flex: 1,
  },
  degradationFeature: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
    textDecoration: 'none',
  },
  degradationMeta: {
    fontSize: 9,
    color: '#64748b',
    textDecoration: 'none',
  },
  // Maintenance
  maintenanceBox: {
    padding: 15,
    borderRadius: 6,
  },
  maintenanceLevel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    textDecoration: 'none',
  },
  maintenanceMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
    textDecoration: 'none',
  },
  maintenanceDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.5,
    textDecoration: 'none',
  },
  // AI Insights
  insightCard: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
    textDecoration: 'none',
  },
  insightDesc: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
    textDecoration: 'none',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    textDecoration: 'none',
  },
});

// Color helpers
const getKPIConfig = (id, value) => {
  switch(id) {
    case 'failure':
      if (value >= 70) return { color: '#ef4444', bg: '#fef2f2' };
      if (value >= 40) return { color: '#f97316', bg: '#fff7ed' };
      return { color: '#22c55e', bg: '#f0fdf4' };
    case 'rul':
      if (value <= 30) return { color: '#ef4444', bg: '#fef2f2' };
      if (value <= 60) return { color: '#f97316', bg: '#fff7ed' };
      return { color: '#3b82f6', bg: '#eff6ff' };
    case 'anomaly':
      if (value >= 0.5) return { color: '#ef4444', bg: '#fef2f2' };
      if (value >= 0.1) return { color: '#f97316', bg: '#fff7ed' };
      return { color: '#8b5cf6', bg: '#f5f3ff' };
    case 'health':
      if (value >= 80) return { color: '#22c55e', bg: '#f0fdf4' };
      if (value >= 50) return { color: '#f97316', bg: '#fff7ed' };
      return { color: '#ef4444', bg: '#fef2f2' };
    default:
      return { color: '#3b82f6', bg: '#eff6ff' };
  }
};

const getComponentColor = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f97316';
  return '#ef4444';
};

const getMaintenanceConfig = (level) => {
  switch(level) {
    case 'normal':
      return { color: '#22c55e', bg: '#f0fdf4', border: '#22c55e' };
    case 'soon':
      return { color: '#3b82f6', bg: '#eff6ff', border: '#3b82f6' };
    case 'warning':
      return { color: '#f97316', bg: '#fff7ed', border: '#f97316' };
    case 'immediate':
    case 'critical':
      return { color: '#ef4444', bg: '#fef2f2', border: '#ef4444' };
    default:
      return { color: '#3b82f6', bg: '#eff6ff', border: '#3b82f6' };
  }
};

// Format date
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

// Parse AI insights from JSON string (same logic as DegradationContributors)
const parseInsights = (insightsStr) => {
  if (!insightsStr) return null;
  
  // If already an array, return directly
  if (Array.isArray(insightsStr)) return insightsStr;
  
  try {
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
    console.error('Failed to parse AI insights for PDF:', e);
    return null;
  }
};

// Main PDF Document Component
const MaintenanceReportPDF = ({ data, aiInsights = null }) => {
  if (!data) return null;

  const { kpis, component_health, degradation_contributors, maintenance_decision } = data;
  
  // Parse AI insights if string
  const parsedInsights = parseInsights(aiInsights);
  
  // KPI cards config
  const kpiCards = [
    { id: 'failure', label: 'Failure Risk', value: kpis?.failure_probability || 0, unit: '%', format: v => Math.round(v) },
    { id: 'rul', label: 'Remaining Useful Life', value: kpis?.remaining_useful_life || 0, unit: 'cycles', format: v => Math.round(v) },
    { id: 'anomaly', label: 'Anomaly Score', value: kpis?.anomaly_score || 0, unit: '', format: v => v.toFixed(4) },
    { id: 'health', label: 'Overall Health', value: kpis?.overall_health || 0, unit: '%', format: v => Math.round(v) },
  ];

  const maintenanceConfig = getMaintenanceConfig(maintenance_decision?.level);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Vehicle Health Monitoring</Text>
          <Text style={styles.subtitle}>Maintenance Analysis Report</Text>
          <Text style={styles.generatedDate}>Generated: {formatDate(new Date())}</Text>
        </View>

        {/* KPIs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.kpiGrid}>
            {kpiCards.map((kpi) => {
              const config = getKPIConfig(kpi.id, kpi.value);
              return (
                <View key={kpi.id} style={[styles.kpiCard, { backgroundColor: config.bg }]}>
                  <Text style={styles.kpiLabel}>{kpi.label}</Text>
                  <Text style={[styles.kpiValue, { color: config.color }]}>
                    {kpi.format(kpi.value)}
                    <Text style={styles.kpiUnit}> {kpi.unit}</Text>
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Component Health Section */}
        {component_health && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Component Health</Text>
            {Object.entries(component_health).map(([name, data]) => {
              const color = getComponentColor(data.score);
              return (
                <View key={name} style={styles.componentRow}>
                  <Text style={styles.componentName}>{name}</Text>
                  <Text style={[styles.componentScore, { color }]}>{data.score}%</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBar, { width: `${data.score}%`, backgroundColor: color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Degradation Factors Section */}
        {degradation_contributors && degradation_contributors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Degradation Factors</Text>
            {degradation_contributors.map((contributor, index) => (
              <View key={index} style={styles.degradationRow}>
                <Text style={styles.degradationRank}>{index + 1}</Text>
                <View style={styles.degradationContent}>
                  <Text style={styles.degradationFeature}>{contributor.feature}</Text>
                  <Text style={styles.degradationMeta}>
                    Value: {contributor.value} • Impact: {contributor.importance.toFixed(3)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Maintenance Recommendation Section */}
        {maintenance_decision && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maintenance Recommendation</Text>
            <View style={[styles.maintenanceBox, { 
              backgroundColor: maintenanceConfig.bg,
              borderLeft: `4px solid ${maintenanceConfig.border}`
            }]}>
              <Text style={[styles.maintenanceLevel, { color: maintenanceConfig.color }]}>
                {maintenance_decision.level?.toUpperCase() || 'UNKNOWN'}
              </Text>
              <Text style={styles.maintenanceMessage}>
                {maintenance_decision.message?.replace(/[🚨⚠️✅]/g, '') || 'No recommendation'}
              </Text>
              <Text style={styles.maintenanceDesc}>
                {maintenance_decision.description || ''}
              </Text>
            </View>
          </View>
        )}

        {/* AI Insights Section - if available */}
        {parsedInsights && parsedInsights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI-Powered Analysis</Text>
            {parsedInsights.map((insight, index) => (
              <View 
                key={index} 
                style={[styles.insightCard, { 
                  backgroundColor: insight.type === 'critical' ? '#fef2f2' : 
                                   insight.type === 'warning' ? '#fff7ed' : 
                                   insight.type === 'tip' ? '#f0fdf4' : '#eff6ff'
                }]}
              >
                <Text style={[styles.insightTitle, {
                  color: insight.type === 'critical' ? '#ef4444' : 
                         insight.type === 'warning' ? '#f97316' : 
                         insight.type === 'tip' ? '#22c55e' : '#3b82f6'
                }]}>
                  {insight.title}
                </Text>
                <Text style={styles.insightDesc}>{insight.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Confidential • Vehicle Health Monitoring System</Text>
          <Text style={styles.footerText}>© 2026 Predictive Maintenance Platform</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MaintenanceReportPDF;
