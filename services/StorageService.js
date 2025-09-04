/**
 * Storage Service
 * Simple in-memory storage for development
 */

class StorageService {
  constructor() {
    this.keys = {
      authToken: 'gu_auth_token',
      refreshToken: 'gu_refresh_token',
      tokenExpiry: 'gu_token_expiry',
      userProfile: 'gu_user_profile',
      userRoles: 'gu_user_roles',
      userPermissions: 'gu_user_permissions',
      appSettings: 'gu_app_settings',
    };
    
    // In-memory storage
    this.memoryStorage = new Map();
  }

  /**
   * Store a value in memory
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {Promise} Storage result
   */
  async setItem(key, value) {
    try {
      this.memoryStorage.set(key, value);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  /**
   * Retrieve a value from memory
   * @param {string} key - Storage key
   * @returns {Promise<any>} Stored value
   */
  async getItem(key) {
    try {
      return this.memoryStorage.get(key) || null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  /**
   * Remove a value from memory
   * @param {string} key - Storage key
   * @returns {Promise} Removal result
   */
  async removeItem(key) {
    try {
      this.memoryStorage.delete(key);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  /**
   * Clear all stored data
   * @returns {Promise} Clear result
   */
  async clear() {
    try {
      this.memoryStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  // ============================================================================
  // AUTHENTICATION STORAGE
  // ============================================================================

  /**
   * Store authentication token
   * @param {string} token - Auth token
   * @returns {Promise} Storage result
   */
  async storeAuthToken(token) {
    return this.setItem(this.keys.authToken, token);
  }

  /**
   * Get stored authentication token
   * @returns {Promise<string|null>} Auth token
   */
  async getAuthToken() {
    return this.getItem(this.keys.authToken);
  }

  /**
   * Remove stored authentication token
   * @returns {Promise} Removal result
   */
  async removeAuthToken() {
    return this.removeItem(this.keys.authToken);
  }

  /**
   * Store refresh token
   * @param {string} token - Refresh token
   * @returns {Promise} Storage result
   */
  async storeRefreshToken(token) {
    return this.setItem(this.keys.refreshToken, token);
  }

  /**
   * Get stored refresh token
   * @returns {Promise<string|null>} Refresh token
   */
  async getRefreshToken() {
    return this.getItem(this.keys.refreshToken);
  }

  /**
   * Remove stored refresh token
   * @returns {Promise} Removal result
   */
  async removeRefreshToken() {
    return this.removeItem(this.keys.refreshToken);
  }

  /**
   * Store token expiry time
   * @param {Date|string} expiry - Token expiry time
   * @returns {Promise} Storage result
   */
  async storeTokenExpiry(expiry) {
    const expiryTime = expiry instanceof Date ? expiry.toISOString() : expiry;
    return this.setItem(this.keys.tokenExpiry, expiryTime);
  }

  /**
   * Get stored token expiry time
   * @returns {Promise<Date|null>} Token expiry time
   */
  async getTokenExpiry() {
    const expiry = await this.getItem(this.keys.tokenExpiry);
    return expiry ? new Date(expiry) : null;
  }

  /**
   * Check if token is expired
   * @returns {Promise<boolean>} Token expiry status
   */
  async isTokenExpired() {
    const expiry = await this.getTokenExpiry();
    if (!expiry) return true;
    return new Date() > expiry;
  }

  // ============================================================================
  // USER DATA STORAGE
  // ============================================================================

  /**
   * Store user profile
   * @param {Object} profile - User profile data
   * @returns {Promise} Storage result
   */
  async storeUserProfile(profile) {
    return this.setItem(this.keys.userProfile, profile);
  }

  /**
   * Get stored user profile
   * @returns {Promise<Object|null>} User profile
   */
  async getUserProfile() {
    return this.getItem(this.keys.userProfile);
  }

  /**
   * Remove stored user profile
   * @returns {Promise} Removal result
   */
  async removeUserProfile() {
    return this.removeItem(this.keys.userProfile);
  }

  /**
   * Store user roles
   * @param {Array} roles - User roles data
   * @returns {Promise} Storage result
   */
  async storeUserRoles(roles) {
    return this.setItem(this.keys.userRoles, roles);
  }

  /**
   * Get stored user roles
   * @returns {Promise<Array|null>} User roles
   */
  async getUserRoles() {
    return this.getItem(this.keys.userRoles);
  }

  /**
   * Remove stored user roles
   * @returns {Promise} Removal result
   */
  async removeUserRoles() {
    return this.removeItem(this.keys.userRoles);
  }

  /**
   * Store user permissions
   * @param {Array} permissions - User permissions data
   * @returns {Promise} Storage result
   */
  async storeUserPermissions(permissions) {
    return this.setItem(this.keys.userPermissions, permissions);
  }

  /**
   * Get stored user permissions
   * @returns {Promise<Array|null>} User permissions
   */
  async getUserPermissions() {
    return this.getItem(this.keys.userPermissions);
  }

  /**
   * Remove stored user permissions
   * @returns {Promise} Removal result
   */
  async removeUserPermissions() {
    return this.removeItem(this.keys.userPermissions);
  }

  // ============================================================================
  // APP SETTINGS STORAGE
  // ============================================================================

  /**
   * Store app settings
   * @param {Object} settings - App settings
   * @returns {Promise} Storage result
   */
  async storeAppSettings(settings) {
    return this.setItem(this.keys.appSettings, settings);
  }

  /**
   * Get stored app settings
   * @returns {Promise<Object|null>} App settings
   */
  async getAppSettings() {
    return this.getItem(this.keys.appSettings);
  }

  /**
   * Update specific app setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise} Storage result
   */
  async updateAppSetting(key, value) {
    const settings = await this.getAppSettings() || {};
    settings[key] = value;
    return this.storeAppSettings(settings);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Clear all authentication data
   * @returns {Promise} Clear result
   */
  async clearAuthData() {
    const promises = [
      this.removeAuthToken(),
      this.removeRefreshToken(),
      this.removeTokenExpiry(),
      this.removeUserProfile(),
      this.removeUserRoles(),
      this.removeUserPermissions(),
    ];
    
    try {
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Clear auth data error:', error);
      return false;
    }
  }

  /**
   * Get storage information
   * @returns {Promise<Object>} Storage info
   */
  async getStorageInfo() {
    try {
      // For in-memory storage, we can easily get all keys
      const allKeys = Array.from(this.memoryStorage.keys());
      const info = {
        totalKeys: allKeys.length,
        authKeys: Object.values(this.keys).filter(key => allKeys.includes(key)).length,
        otherKeys: allKeys.length - Object.values(this.keys).filter(key => allKeys.includes(key)).length,
        secureStoreAvailable: false, // In-memory storage is not secure
      };
      return info;
    } catch (error) {
      console.error('Get storage info error:', error);
      return null;
    }
  }

  /**
   * Check if storage is working
   * @returns {Promise<boolean>} Storage availability
   */
  async isStorageWorking() {
    try {
      const testKey = 'storage_test_key';
      const testValue = 'test_value';
      
      const setResult = await this.setItem(testKey, testValue);
      if (!setResult) return false;
      
      const retrievedValue = await this.getItem(testKey);
      if (retrievedValue !== testValue) return false;
      
      const removeResult = await this.removeItem(testKey);
      return removeResult;
    } catch (error) {
      console.error('Storage test failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const storageService = new StorageService();

export default storageService;
