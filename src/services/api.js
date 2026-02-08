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
 * Get AI-powered insights for degradation factors
 * @param {Array} contributors - Degradation contributors
 * @param {Object} kpis - Key performance indicators
 * @param {Object} componentHealth - Component health scores
 * @returns {Promise} AI-generated insights
 */
export const getAIInsights = async (contributors, kpis = null, componentHealth = null) => {
  try {
    const response = await api.post('/ai/insights', {
      contributors,
      kpis,
      component_health: componentHealth
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get AI insights');
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

/**
 * Upload PDF report to Cloudinary
 * @param {string} pdfBase64 - Base64 encoded PDF data
 * @param {string} filename - Optional custom filename
 * @returns {Promise} Upload result with Cloudinary URL
 */
export const uploadPDFToCloudinary = async (pdfBase64, filename = null) => {
  try {
    const response = await api.post('/upload-pdf', {
      pdf_data: pdfBase64,
      filename
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to upload PDF');
  }
};

/**
 * Initialize chatbot with vehicle health context
 * @param {Object} predictionData - The prediction results
 * @param {string} pdfUrl - Optional Cloudinary PDF URL
 * @returns {Promise} Initialization result with greeting
 */
export const initializeChatbot = async (predictionData, pdfUrl = null) => {
  try {
    const response = await api.post('/chatbot/init', {
      prediction_data: predictionData,
      pdf_url: pdfUrl
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to initialize chatbot');
  }
};

/**
 * Send a message to the chatbot
 * @param {string} message - User's message
 * @returns {Promise} Chatbot response
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/chatbot/message', { message });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send message');
  }
};

/**
 * Send PDF report link via email
 * @param {string} email - Recipient email address
 * @param {string} pdfUrl - Cloudinary PDF URL
 * @param {string} reportDate - Optional report date
 * @returns {Promise} Email send result
 */
export const sendReportEmail = async (email, pdfUrl, reportDate = null) => {
  try {
    const response = await api.post('/send-report-email', {
      email,
      pdf_url: pdfUrl,
      report_date: reportDate
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send email');
  }
};

export default api;

