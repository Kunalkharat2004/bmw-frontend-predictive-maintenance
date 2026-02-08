/**
 * API Service Layer
 * Handles all communication with the Flask backend
 */
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Predict vehicle health based on telemetry features
 * @param {Array<number>} features - Array of 12 telemetry values
 * @returns {Promise} Prediction results
 */
export const predictVehicleHealth = async (features) => {
  try {
    const response = await api.post('/predict', { features });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get prediction');
  }
};

/**
 * Get nearby BMW service centers
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radius - Search radius in meters (default 10000)
 * @returns {Promise} List of service centers
 */
export const getServiceCenters = async (latitude, longitude, radius = 10000) => {
  try {
    const response = await api.get('/service-centers', {
      params: { lat: latitude, lng: longitude, radius }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to load service centers');
  }
};

/**
 * Send SMS alert via Twilio
 * @param {string} phone - Recipient phone number
 * @param {number} failureProb - Failure probability percentage
 * @param {number} rul - Remaining useful life
 * @param {string} severity - Alert severity level
 * @param {Object} nearestCenter - Nearest service center info (optional)
 * @returns {Promise} Alert send status
 */
export const sendAlert = async (phone, failureProb, rul, severity, nearestCenter = null) => {
  try {
    const response = await api.post('/alerts/send', {
      phone,
      failure_prob: failureProb,
      rul,
      severity,
      nearest_center: nearestCenter
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send alert');
  }
};

/**
 * Test Twilio connection
 * @returns {Promise} Connection status
 */
export const testAlertService = async () => {
  try {
    const response = await api.get('/alerts/test');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to test alert service');
  }
};

/**
 * Get place details by ID
 * @param {string} placeId - Google Place ID
 * @returns {Promise} Place details
 */
export const getPlaceDetails = async (placeId) => {
  try {
    const response = await api.get(`/place/${placeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get place details');
  }
};

/**
 * Health check endpoint
 * @returns {Promise} API health status
 */
export const healthCheck = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_BASE_URL?.replace('/api', '/health') || 'http://localhost:5000/health'
    );
    return response.data;
  } catch (error) {
    throw new Error('Backend API is not responding');
  }
};

export default api;
