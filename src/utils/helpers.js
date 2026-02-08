/**
 * Utility functions for the application
 */

/**
 * Format percentage with optional decimal places
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places (default 1)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with commas
 * @param {number} value - Value to format
 * @returns {string} Formatted number
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Get color based on health score
 * @param {number} score - Health score (0-100)
 * @returns {string} Tailwind color class
 */
export const getHealthColor = (score) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Get background color based on health score
 * @param {number} score - Health score (0-100)
 * @returns {string} Tailwind background color class
 */
export const getHealthBgColor = (score) => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 50) return 'bg-yellow-100';
  return 'bg-red-100';
};

/**
 * Get severity badge color
 * @param {string} level - Severity level ('normal', 'warning', 'critical')
 * @returns {Object} Tailwind color classes
 */
export const getSeverityColors = (level) => {
  const colors = {
    normal: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300'
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300'
    },
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300'
    },
    soon: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300'
    },
    immediate: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300'
    }
  };
  
  return colors[level] || colors.normal;
};

/**
 * Debounce function for slider inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Feature definitions with metadata
 */
export const FEATURE_DEFINITIONS = [
  {
    id: 'soc',
    name: 'State of Charge',
    unit: '%',
    min: 0,
    max: 100,
    default: 80,
    normalize: (value) => value / 100,
    category: 'battery'
  },
  {
    id: 'soh',
    name: 'State of Health',
    unit: '%',
    min: 0,
    max: 100,
    default: 90,
    normalize: (value) => value / 100,
    category: 'battery'
  },
  {
    id: 'voltage',
    name: 'Battery Voltage',
    unit: 'V',
    min: 250,
    max: 420,
    default: 360,
    normalize: (value) => value,
    category: 'battery'
  },
  {
    id: 'current',
    name: 'Battery Current',
    unit: 'A',
    min: -80,
    max: 80,
    default: -25,
    normalize: (value) => value,
    category: 'battery'
  },
  {
    id: 'batteryTemp',
    name: 'Battery Temperature',
    unit: '°C',
    min: 20,
    max: 70,
    default: 32,
    normalize: (value) => value,
    category: 'thermal'
  },
  {
    id: 'motorTemp',
    name: 'Motor Temperature',
    unit: '°C',
    min: 30,
    max: 110,
    default: 65,
    normalize: (value) => value,
    category: 'thermal'
  },
  {
    id: 'vibration',
    name: 'Motor Vibration',
    unit: 'mm/s',
    min: 0,
    max: 3,
    default: 0.6,
    step: 0.1,
    normalize: (value) => value,
    category: 'motor'
  },
  {
    id: 'rpm',
    name: 'Motor Speed',
    unit: 'rpm',
    min: 0,
    max: 6000,
    default: 2200,
    step: 100,
    normalize: (value) => value,
    category: 'motor'
  },
  {
    id: 'brakeWear',
    name: 'Brake Pad Wear',
    unit: '%',
    min: 0,
    max: 100,
    default: 25,
    normalize: (value) => value / 100,
    category: 'braking'
  },
  {
    id: 'powerStress',
    name: 'Power Stress',
    unit: 'kW',
    min: 0,
    max: 50,
    default: 8,
    normalize: (value) => value,
    category: 'usage'
  },
  {
    id: 'usageIntensity',
    name: 'Usage Intensity',
    unit: 'index',
    min: 0,
    max: 100,
    default: 45,
    normalize: (value) => value,
    category: 'usage'
  },
  {
    id: 'healthTrend',
    name: 'Overall Health Trend',
    unit: '%',
    min: 0,
    max: 100,
    default: 85,
    normalize: (value) => value / 100,
    category: 'overall'
  }
];

/**
 * Get default feature values
 * @returns {Array<number>} Array of normalized default values
 */
export const getDefaultFeatures = () => {
  return FEATURE_DEFINITIONS.map(feature => 
    feature.normalize(feature.default)
  );
};

/**
 * Convert UI values to normalized features for API
 * @param {Object} uiValues - UI input values
 * @returns {Array<number>} Normalized feature array
 */
export const convertToFeatures = (uiValues) => {
  return FEATURE_DEFINITIONS.map(feature => 
    feature.normalize(uiValues[feature.id])
  );
};
