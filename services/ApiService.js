/**
 * GU API Service - Privilege System
 * Comprehensive API service for managing user authentication, roles, permissions, 
 * geographic sectors, and properties.
 */

class ApiService {
  constructor() {
    // Base URL - can be configured for different environments
    this.baseURL = 'https://gu.mindware.com.mx/api/v1';
    this.token = null;
    this.isAuthenticated = false;
  }

  /**
   * Set the base URL for the API
   * @param {string} url - The base URL
   */
  setBaseURL(url) {
    this.baseURL = url;
  }

  /**
   * Set the authentication token
   * @param {string} token - The Bearer token
   */
  setToken(token) {
    this.token = token;
    this.isAuthenticated = !!token;
  }

  /**
   * Clear the authentication token
   */
  clearToken() {
    this.token = null;
    this.isAuthenticated = false;
  }

  /**
   * Get headers for API requests
   * @param {boolean} includeAuth - Whether to include authorization header
   * @returns {Object} Headers object
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make an API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: this.getHeaders(options.requireAuth !== false),
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    // Debug logging
    console.log('🔗 API Request:', {
      url,
      method: config.method,
      headers: config.headers,
      body: options.body ? JSON.stringify(options.body, null, 2) : 'No body',
      requireAuth: options.requireAuth !== false,
      hasToken: !!this.token,
    });

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Debug logging for response
      console.log('📡 API Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: JSON.stringify(data, null, 2),
      });

      if (!response.ok) {
        console.error('❌ API Error:', {
          url,
          status: response.status,
          statusText: response.statusText,
          error: data.message || `HTTP ${response.status}`,
        });
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      console.log('✅ API Success:', {
        url,
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });

      return data;
    } catch (error) {
      console.error('💥 API Request Error:', {
        url,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // ============================================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================================

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: userData,
      requireAuth: false,
    });
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise} Login response
   */
  async login(credentials) {
    const response = await this.request('/login', {
      method: 'POST',
      body: credentials,
      requireAuth: false,
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  async logout() {
    const response = await this.request('/logout', {
      method: 'POST',
    });

    if (response.success) {
      this.clearToken();
    }

    return response;
  }

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise} Password reset response
   */
  async forgotPassword(email) {
    return this.request('/forgot-password', {
      method: 'POST',
      body: { email },
      requireAuth: false,
    });
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @returns {Promise} Password reset response
   */
  async resetPassword(resetData) {
    return this.request('/reset-password', {
      method: 'POST',
      body: resetData,
      requireAuth: false,
    });
  }

  /**
   * Verify reset token
   * @param {string} email - User's email
   * @param {string} token - Reset token
   * @returns {Promise} Token verification response
   */
  async verifyResetToken(email, token) {
    return this.request('/verify-reset-token', {
      method: 'POST',
      body: { email, token },
      requireAuth: false,
    });
  }

  /**
   * Refresh access token
   * @returns {Promise} Token refresh response
   */
  async refreshToken() {
    const response = await this.request('/refresh', {
      method: 'POST',
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // ============================================================================
  // USER MANAGEMENT ENDPOINTS
  // ============================================================================

  /**
   * Get user profile
   * @returns {Promise} User profile response
   */
  async getUserProfile() {
    return this.request('/user');
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} Profile update response
   */
  async updateUserProfile(profileData) {
    return this.request('/user', {
      method: 'PUT',
      body: profileData,
    });
  }

  /**
   * Get user roles
   * @returns {Promise} User roles response
   */
  async getUserRoles() {
    return this.request('/user/roles');
  }

  /**
   * Get user permissions
   * @returns {Promise} User permissions response
   */
  async getUserPermissions() {
    return this.request('/user/permissions');
  }

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @returns {Promise} Password change response
   */
  async changePassword(passwordData) {
    return this.request('/change-password', {
      method: 'POST',
      body: passwordData,
    });
  }

  // ============================================================================
  // GEOGRAPHIC DATA ENDPOINTS
  // ============================================================================

  /**
   * List sectors
   * @param {Object} params - Query parameters
   * @returns {Promise} Sectors response
   */
  async listSectors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/sectors?${queryString}` : '/sectors';
    return this.request(endpoint);
  }

  /**
   * Get sector details
   * @param {number} sectorId - Sector ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Sector response
   */
  async getSector(sectorId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `/sectors/${sectorId}?${queryString}` 
      : `/sectors/${sectorId}`;
    return this.request(endpoint);
  }

  /**
   * List properties
   * @param {Object} params - Query parameters
   * @returns {Promise} Properties response
   */
  async listProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    return this.request(endpoint);
  }

  /**
   * Get property details
   * @param {number} propertyId - Property ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Property response
   */
  async getProperty(propertyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `/properties/${propertyId}?${queryString}` 
      : `/properties/${propertyId}`;
    return this.request(endpoint);
  }

  // ============================================================================
  // ANALYTICS ENDPOINTS
  // ============================================================================

  /**
   * Register a simple analytics event
   * @param {Object} eventData - Event data
   * @param {string} eventData.device_uuid - Unique identifier for the device
   * @param {string} eventData.event_keyword - Keyword describing the event
   * @param {string} [eventData.app_version] - Application version
   * @param {string} [eventData.platform] - Platform (ios, android, web)
   * @param {string} [eventData.platform_version] - Platform version
   * @param {number} [eventData.latitude] - Device latitude (-90 to 90)
   * @param {number} [eventData.longitude] - Device longitude (-180 to 180)
   * @param {string} [eventData.location_accuracy] - Location accuracy (high, medium, low)
   * @returns {Promise} Analytics event registration response
   */
  async registerAnalyticsEvent(eventData) {
    console.log('📊 Analytics Event Registration:', {
      eventData: JSON.stringify(eventData, null, 2),
      timestamp: new Date().toISOString(),
    });

    const requiredFields = ['device_uuid', 'event_keyword'];
    
    // Validate required fields
    for (const field of requiredFields) {
      if (!eventData[field]) {
        console.error('❌ Analytics Validation Error:', {
          missingField: field,
          eventData: JSON.stringify(eventData, null, 2),
        });
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate field lengths
    if (eventData.device_uuid.length > 255) {
      console.error('❌ Analytics Validation Error:', {
        field: 'device_uuid',
        length: eventData.device_uuid.length,
        maxLength: 255,
      });
      throw new Error('device_uuid exceeds maximum length of 255 characters');
    }
    if (eventData.event_keyword.length > 255) {
      console.error('❌ Analytics Validation Error:', {
        field: 'event_keyword',
        length: eventData.event_keyword.length,
        maxLength: 255,
      });
      throw new Error('event_keyword exceeds maximum length of 255 characters');
    }

    // Validate latitude and longitude if provided
    if (eventData.latitude !== undefined) {
      if (typeof eventData.latitude !== 'number' || eventData.latitude < -90 || eventData.latitude > 90) {
        console.error('❌ Analytics Validation Error:', {
          field: 'latitude',
          value: eventData.latitude,
          type: typeof eventData.latitude,
          validRange: '[-90, 90]',
        });
        throw new Error('latitude must be a number between -90 and 90');
      }
    }
    if (eventData.longitude !== undefined) {
      if (typeof eventData.longitude !== 'number' || eventData.longitude < -180 || eventData.longitude > 180) {
        console.error('❌ Analytics Validation Error:', {
          field: 'longitude',
          value: eventData.longitude,
          type: typeof eventData.longitude,
          validRange: '[-180, 180]',
        });
        throw new Error('longitude must be a number between -180 and 180');
      }
    }

    // Validate location accuracy if provided
    if (eventData.location_accuracy !== undefined) {
      const validAccuracies = ['high', 'medium', 'low'];
      if (!validAccuracies.includes(eventData.location_accuracy)) {
        console.error('❌ Analytics Validation Error:', {
          field: 'location_accuracy',
          value: eventData.location_accuracy,
          validValues: validAccuracies,
        });
        throw new Error('location_accuracy must be one of: high, medium, low');
      }
    }

    console.log('✅ Analytics Event Validation Passed:', {
      eventKeyword: eventData.event_keyword,
      deviceUUID: eventData.device_uuid,
      hasLocation: !!(eventData.latitude && eventData.longitude),
      timestamp: new Date().toISOString(),
    });

    return this.request('/analytics/register-event', {
      method: 'POST',
      body: eventData,
      requireAuth: true, // Analytics endpoints require authentication
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isUserAuthenticated() {
    return this.isAuthenticated && !!this.token;
  }

  /**
   * Get current token
   * @returns {string|null} Current token
   */
  getCurrentToken() {
    return this.token;
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Object} Formatted error response
   */
  handleError(error) {
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: error.toString(),
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Validation result
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with details
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid = password.length >= minLength && 
                   hasUpperCase && 
                   hasLowerCase && 
                   hasNumbers && 
                   hasSpecialChar;

    return {
      isValid,
      details: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;
