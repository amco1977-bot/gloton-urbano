/**
 * Enhanced API Service
 * Integrates with storage service for token persistence and automatic token refresh
 */

import apiService from './ApiService';
import storageService from './StorageService';
import config from './config';

class EnhancedApiService {
  constructor() {
    this.isInitialized = false;
    this.refreshPromise = null;
  }

  /**
   * Initialize the service with stored token
   * @returns {Promise} Initialization result
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Set base URL from config
      apiService.setBaseURL(config.baseURL);

      // Restore token from storage
      const token = await storageService.getAuthToken();
      if (token) {
        apiService.setToken(token);
        
        // Check if token is expired
        const isExpired = await storageService.isTokenExpired();
        if (isExpired) {
          // Try to refresh token
          await this.refreshToken();
        }
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('EnhancedApiService initialization error:', error);
      return false;
    }
  }

  /**
   * Enhanced login with storage integration
   * @param {Object} credentials - Login credentials
   * @returns {Promise} Login response
   */
  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data.token) {
        // Store token and user data
        await storageService.storeAuthToken(response.data.token);
        await storageService.storeUserProfile(response.data.user);
        
        // Set token expiry (assuming 24 hours if not provided)
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        await storageService.storeTokenExpiry(expiry);
      }

      return response;
    } catch (error) {
      console.error('Enhanced login error:', error);
      throw error;
    }
  }

  /**
   * Enhanced logout with storage cleanup
   * @returns {Promise} Logout response
   */
  async logout() {
    try {
      const response = await apiService.logout();
      
      if (response.success) {
        // Clear all stored data
        await storageService.clearAuthData();
        apiService.clearToken();
      }

      return response;
    } catch (error) {
      console.error('Enhanced logout error:', error);
      // Even if API call fails, clear local data
      await storageService.clearAuthData();
      apiService.clearToken();
      throw error;
    }
  }

  /**
   * Enhanced token refresh with storage integration
   * @returns {Promise} Token refresh response
   */
  async refreshToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await apiService.refreshToken();
        
        if (response.success && response.data.token) {
          // Update stored token
          await storageService.storeAuthToken(response.data.token);
          
          // Update token expiry
          const expiry = new Date();
          expiry.setHours(expiry.getHours() + 24);
          await storageService.storeTokenExpiry(expiry);
        }

        return response;
      } catch (error) {
        console.error('Token refresh error:', error);
        // Clear stored data on refresh failure
        await storageService.clearAuthData();
        apiService.clearToken();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Enhanced API request with automatic token refresh
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} API response
   */
  async request(endpoint, options = {}) {
    await this.initialize();

    try {
      return await apiService.request(endpoint, options);
    } catch (error) {
      // If token is expired, try to refresh and retry
      if (error.message.includes('401') && options.requireAuth !== false) {
        try {
          await this.refreshToken();
          // Retry the original request
          return await apiService.request(endpoint, options);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          await this.logout();
          throw new Error('Authentication expired. Please login again.');
        }
      }
      throw error;
    }
  }

  /**
   * Get user profile with caching
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise} User profile
   */
  async getUserProfile(forceRefresh = false) {
    if (!forceRefresh) {
      const cachedProfile = await storageService.getUserProfile();
      if (cachedProfile) {
        return { success: true, data: { user: cachedProfile } };
      }
    }

    const response = await this.request('/user');
    
    if (response.success && response.data.user) {
      await storageService.storeUserProfile(response.data.user);
    }

    return response;
  }

  /**
   * Get user roles with caching
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise} User roles
   */
  async getUserRoles(forceRefresh = false) {
    if (!forceRefresh) {
      const cachedRoles = await storageService.getUserRoles();
      if (cachedRoles) {
        return { success: true, data: { roles: cachedRoles } };
      }
    }

    const response = await this.request('/user/roles');
    
    if (response.success && response.data.roles) {
      await storageService.storeUserRoles(response.data.roles);
    }

    return response;
  }

  /**
   * Get user permissions with caching
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise} User permissions
   */
  async getUserPermissions(forceRefresh = false) {
    if (!forceRefresh) {
      const cachedPermissions = await storageService.getUserPermissions();
      if (cachedPermissions) {
        return { success: true, data: { permissions: cachedPermissions } };
      }
    }

    const response = await this.request('/user/permissions');
    
    if (response.success && response.data.permissions) {
      await storageService.storeUserPermissions(response.data.permissions);
    }

    return response;
  }

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {Promise<boolean>} Permission status
   */
  async hasPermission(permission) {
    try {
      const response = await this.getUserPermissions();
      if (response.success && response.data.permissions) {
        return response.data.permissions.includes(permission);
      }
      return false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  /**
   * Check if user has any of the specified permissions
   * @param {Array<string>} permissions - Permissions to check
   * @returns {Promise<boolean>} Permission status
   */
  async hasAnyPermission(permissions) {
    try {
      const response = await this.getUserPermissions();
      if (response.success && response.data.permissions) {
        return permissions.some(permission => 
          response.data.permissions.includes(permission)
        );
      }
      return false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  /**
   * Check if user has all of the specified permissions
   * @param {Array<string>} permissions - Permissions to check
   * @returns {Promise<boolean>} Permission status
   */
  async hasAllPermissions(permissions) {
    try {
      const response = await this.getUserPermissions();
      if (response.success && response.data.permissions) {
        return permissions.every(permission => 
          response.data.permissions.includes(permission)
        );
      }
      return false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  /**
   * Get user's highest role level
   * @returns {Promise<number>} Highest role level
   */
  async getHighestRoleLevel() {
    try {
      const response = await this.getUserPermissions();
      if (response.success && response.data.highest_role_level) {
        return response.data.highest_role_level;
      }
      return 1; // Default to regular user level
    } catch (error) {
      console.error('Role level check error:', error);
      return 1;
    }
  }

  // ============================================================================
  // PROXY METHODS TO BASE API SERVICE
  // ============================================================================

  // Authentication methods
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: userData,
      requireAuth: false,
    });
  }

  async forgotPassword(email) {
    return this.request('/forgot-password', {
      method: 'POST',
      body: { email },
      requireAuth: false,
    });
  }

  async resetPassword(resetData) {
    return this.request('/reset-password', {
      method: 'POST',
      body: resetData,
      requireAuth: false,
    });
  }

  async verifyResetToken(email, token) {
    return this.request('/verify-reset-token', {
      method: 'POST',
      body: { email, token },
      requireAuth: false,
    });
  }

  // User management methods
  async updateUserProfile(profileData) {
    const response = await this.request('/user', {
      method: 'PUT',
      body: profileData,
    });

    if (response.success && response.data.user) {
      await storageService.storeUserProfile(response.data.user);
    }

    return response;
  }

  async changePassword(passwordData) {
    return this.request('/change-password', {
      method: 'POST',
      body: passwordData,
    });
  }

  // Geographic data methods
  async listSectors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/sectors?${queryString}` : '/sectors';
    return this.request(endpoint);
  }

  async getSector(sectorId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `/sectors/${sectorId}?${queryString}` 
      : `/sectors/${sectorId}`;
    return this.request(endpoint);
  }

  async listProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    return this.request(endpoint);
  }

  async getProperty(propertyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `/properties/${propertyId}?${queryString}` 
      : `/properties/${propertyId}`;
    return this.request(endpoint);
  }

  // Utility methods
  isUserAuthenticated() {
    return apiService.isUserAuthenticated();
  }

  getCurrentToken() {
    return apiService.getCurrentToken();
  }

  validateEmail(email) {
    return apiService.validateEmail(email);
  }

  validatePassword(password) {
    return apiService.validatePassword(password);
  }

  handleError(error) {
    return apiService.handleError(error);
  }
}

// Create and export a singleton instance
const enhancedApiService = new EnhancedApiService();

export default enhancedApiService;
