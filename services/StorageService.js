/**
 * Storage Service
 * Handles local storage operations for tokens and user data using Expo SecureStore
 */

import * as SecureStore from 'expo-secure-store';

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
    
    // Check if SecureStore is available
    this.isSecureStoreAvailable = false;
    this.checkSecureStoreAvailability();
  }

  /**
   * Check if SecureStore is available
   */
  async checkSecureStoreAvailability() {
    try {
      // Try to set a test value
      await SecureStore.setItemAsync('test_availability', 'test');
      await SecureStore.deleteItemAsync('test_availability');
      this.isSecureStoreAvailable = true;
      console.log('SecureStore is available');
    } catch (error) {
      this.isSecureStoreAvailable = false;
      console.warn('SecureStore not available, using fallback:', error.message);
    }
  }

  /**
   * Store a value in SecureStore
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {Promise} Storage result
   */
  async setItem(key, value) {
    try {
      if (!this.isSecureStoreAvailable) {
        console.warn('SecureStore not available, cannot store:', key);
        return false;
      }

      const jsonValue = JSON.stringify(value);
      await SecureStore.setItemAsync(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  /**
   * Retrieve a value from SecureStore
   * @param {string} key - Storage key
   * @returns {Promise<any>} Stored value
   */
  async getItem(key) {
    try {
      if (!this.isSecureStoreAvailable) {
        console.warn('SecureStore not available, cannot retrieve:', key);
        return null;
      }

      const jsonValue = await SecureStore.getItemAsync(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  /**
   * Remove a value from SecureStore
   * @param {string} key - Storage key
   * @returns {Promise} Removal result
   */
  async removeItem(key) {
    try {
      if (!this.isSecureStoreAvailable) {
        console.warn('SecureStore not available, cannot remove:', key);
        return false;
      }

      await SecureStore.deleteItemAsync(key);
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
      const promises = Object.values(this.keys).map(key => this.removeItem(key));
      await Promise.all(promises);
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
      // For SecureStore, we can't get all keys, so we'll check if our keys exist
      const authKeys = Object.values(this.keys);
      const info = {
        totalKeys: authKeys.length,
        authKeys: authKeys.length,
        otherKeys: 0,
        secureStoreAvailable: this.isSecureStoreAvailable,
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
