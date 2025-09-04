/**
 * Analytics Service
 * Provides convenient methods for tracking common analytics events in the app.
 */

import apiService from './ApiService.js';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

class AnalyticsService {
  constructor() {
    this.deviceUUID = null;
    this.appVersion = Constants.expoConfig?.version || '1.0.0';
    this.platform = Platform.OS;
    this.platformVersion = Platform.Version?.toString() || 'unknown';
  }

  /**
   * Initialize the analytics service with device UUID
   * @param {string} deviceUUID - Unique device identifier
   */
  initialize(deviceUUID) {
    console.log('🔧 Analytics Service Initialization:', {
      deviceUUID,
      appVersion: this.appVersion,
      platform: this.platform,
      platformVersion: this.platformVersion,
      timestamp: new Date().toISOString(),
    });
    this.deviceUUID = deviceUUID;
  }

  /**
   * Get device information for analytics
   * @returns {Object} Device information
   */
  getDeviceInfo() {
    return {
      device_uuid: this.deviceUUID,
      app_version: this.appVersion,
      platform: this.platform,
      platform_version: this.platformVersion,
    };
  }

  /**
   * Register a basic analytics event
   * @param {string} eventKeyword - Event keyword
   * @param {Object} additionalData - Additional data to include
   * @returns {Promise} Analytics response
   */
  async registerEvent(eventKeyword, additionalData = {}) {
    console.log('📈 Analytics Event:', {
      eventKeyword,
      additionalData: JSON.stringify(additionalData, null, 2),
      deviceUUID: this.deviceUUID,
      timestamp: new Date().toISOString(),
    });

    if (!this.deviceUUID) {
      console.error('❌ Analytics Service Error:', {
        error: 'Analytics service not initialized. Call initialize() first.',
        eventKeyword,
        timestamp: new Date().toISOString(),
      });
      throw new Error('Analytics service not initialized. Call initialize() first.');
    }

    const eventData = {
      ...this.getDeviceInfo(),
      event_keyword: eventKeyword,
      ...additionalData,
    };

    console.log('📤 Sending Analytics Event:', {
      eventKeyword,
      eventData: JSON.stringify(eventData, null, 2),
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await apiService.registerAnalyticsEvent(eventData);
      console.log('✅ Analytics Event Sent Successfully:', {
        eventKeyword,
        result: JSON.stringify(result, null, 2),
        timestamp: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      console.error('❌ Analytics Event Failed:', {
        eventKeyword,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      // Don't throw the error - just log it and return null
      // This prevents analytics failures from breaking the app flow
      return null;
    }
  }

  /**
   * Track app session start
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackSessionStart(locationData = {}) {
    return this.registerEvent('new_session', locationData);
  }

  /**
   * Track app installation/first launch
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackInstall(locationData = {}) {
    return this.registerEvent('new_install', locationData);
  }

  /**
   * Track onboarding completion
   * @param {Object} onboardingData - Onboarding data
   * @param {string} onboardingData.food_types - Selected food types
   * @param {string} onboardingData.dietary_restrictions - Selected dietary restrictions
   * @param {boolean} onboardingData.location_granted - Whether location was granted
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackOnboardingComplete(onboardingData = {}, locationData = {}) {
    return this.registerEvent('onboarding_complete', {
      ...onboardingData,
      ...locationData,
    });
  }

  /**
   * Track user login
   * @param {Object} loginData - Login data
   * @param {string} loginData.login_method - Login method (email, google, apple, etc.)
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackLogin(loginData = {}, locationData = {}) {
    return this.registerEvent('user_login', {
      ...loginData,
      ...locationData,
    });
  }

  /**
   * Track user registration
   * @param {Object} registrationData - Registration data
   * @param {string} registrationData.registration_method - Registration method
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackRegistration(registrationData = {}, locationData = {}) {
    return this.registerEvent('user_registration', {
      ...registrationData,
      ...locationData,
    });
  }

  /**
   * Track screen view
   * @param {string} screenName - Name of the screen
   * @param {Object} screenData - Additional screen data
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackScreenView(screenName, screenData = {}, locationData = {}) {
    return this.registerEvent('screen_view', {
      screen_name: screenName,
      ...screenData,
      ...locationData,
    });
  }

  /**
   * Track button click
   * @param {string} buttonName - Name of the button
   * @param {string} screenName - Screen where button was clicked
   * @param {Object} buttonData - Additional button data
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackButtonClick(buttonName, screenName, buttonData = {}, locationData = {}) {
    return this.registerEvent('button_click', {
      button_name: buttonName,
      screen_name: screenName,
      ...buttonData,
      ...locationData,
    });
  }

  /**
   * Track feature usage
   * @param {string} featureName - Name of the feature
   * @param {Object} featureData - Additional feature data
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackFeatureUsage(featureName, featureData = {}, locationData = {}) {
    return this.registerEvent('feature_usage', {
      feature_name: featureName,
      ...featureData,
      ...locationData,
    });
  }

  /**
   * Track error occurrence
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Error message
   * @param {Object} errorData - Additional error data
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackError(errorType, errorMessage, errorData = {}, locationData = {}) {
    return this.registerEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      ...errorData,
      ...locationData,
    });
  }

  /**
   * Track app performance
   * @param {string} performanceMetric - Performance metric name
   * @param {number} value - Metric value
   * @param {string} unit - Unit of measurement
   * @param {Object} performanceData - Additional performance data
   * @param {Object} locationData - Optional location data
   * @returns {Promise} Analytics response
   */
  async trackPerformance(performanceMetric, value, unit, performanceData = {}, locationData = {}) {
    return this.registerEvent('performance_metric', {
      metric_name: performanceMetric,
      metric_value: value,
      metric_unit: unit,
      ...performanceData,
      ...locationData,
    });
  }

  /**
   * Track custom event with location
   * @param {string} eventKeyword - Custom event keyword
   * @param {Object} eventData - Event data
   * @param {Object} locationData - Location data
   * @returns {Promise} Analytics response
   */
  async trackCustomEventWithLocation(eventKeyword, eventData = {}, locationData = {}) {
    return this.registerEvent(eventKeyword, {
      ...eventData,
      ...locationData,
    });
  }

  /**
   * Track custom event without location
   * @param {string} eventKeyword - Custom event keyword
   * @param {Object} eventData - Event data
   * @returns {Promise} Analytics response
   */
  async trackCustomEvent(eventKeyword, eventData = {}) {
    return this.registerEvent(eventKeyword, eventData);
  }
}

// Create and export a singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
