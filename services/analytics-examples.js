/**
 * Analytics Service Usage Examples
 * Demonstrates how to use the analytics service for tracking events
 */

import analyticsService from './AnalyticsService';
import * as Location from 'expo-location';

// Example 1: Initialize analytics service
export const initializeAnalytics = async () => {
  try {
    // You should generate a unique device UUID
    const deviceUUID = 'device-12345-abcde'; // In production, use a proper UUID generator
    analyticsService.initialize(deviceUUID);
    console.log('Analytics service initialized');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

// Example 2: Track app session start
export const trackAppSession = async () => {
  try {
    // Get current location if available
    let locationData = {};
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        location_accuracy: 'high',
      };
    }

    await analyticsService.trackSessionStart(locationData);
    console.log('Session start tracked');
  } catch (error) {
    console.error('Failed to track session start:', error);
  }
};

// Example 3: Track app installation
export const trackAppInstall = async () => {
  try {
    await analyticsService.trackInstall();
    console.log('App install tracked');
  } catch (error) {
    console.error('Failed to track app install:', error);
  }
};

// Example 4: Track onboarding completion
export const trackOnboardingComplete = async (selectedFoodTypes, selectedRestrictions, locationGranted) => {
  try {
    const onboardingData = {
      food_types: selectedFoodTypes.join(','),
      dietary_restrictions: selectedRestrictions.join(','),
      location_granted: locationGranted,
    };

    await analyticsService.trackOnboardingComplete(onboardingData);
    console.log('Onboarding completion tracked');
  } catch (error) {
    console.error('Failed to track onboarding completion:', error);
  }
};

// Example 5: Track user login
export const trackUserLogin = async (loginMethod) => {
  try {
    await analyticsService.trackLogin({
      login_method: loginMethod, // 'email', 'google', 'apple', etc.
    });
    console.log('User login tracked');
  } catch (error) {
    console.error('Failed to track user login:', error);
  }
};

// Example 6: Track screen view
export const trackScreenView = async (screenName) => {
  try {
    await analyticsService.trackScreenView(screenName);
    console.log(`Screen view tracked: ${screenName}`);
  } catch (error) {
    console.error('Failed to track screen view:', error);
  }
};

// Example 7: Track button click
export const trackButtonClick = async (buttonName, screenName) => {
  try {
    await analyticsService.trackButtonClick(buttonName, screenName);
    console.log(`Button click tracked: ${buttonName} on ${screenName}`);
  } catch (error) {
    console.error('Failed to track button click:', error);
  }
};

// Example 8: Track feature usage
export const trackFeatureUsage = async (featureName, additionalData = {}) => {
  try {
    await analyticsService.trackFeatureUsage(featureName, additionalData);
    console.log(`Feature usage tracked: ${featureName}`);
  } catch (error) {
    console.error('Failed to track feature usage:', error);
  }
};

// Example 9: Track error
export const trackError = async (errorType, errorMessage, additionalData = {}) => {
  try {
    await analyticsService.trackError(errorType, errorMessage, additionalData);
    console.log(`Error tracked: ${errorType}`);
  } catch (error) {
    console.error('Failed to track error:', error);
  }
};

// Example 10: Track custom event
export const trackCustomEvent = async (eventKeyword, eventData = {}) => {
  try {
    await analyticsService.trackCustomEvent(eventKeyword, eventData);
    console.log(`Custom event tracked: ${eventKeyword}`);
  } catch (error) {
    console.error('Failed to track custom event:', error);
  }
};

// Example 11: Track event with location
export const trackEventWithLocation = async (eventKeyword, eventData = {}) => {
  try {
    let locationData = {};
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        location_accuracy: 'high',
      };
    }

    await analyticsService.trackCustomEventWithLocation(eventKeyword, eventData, locationData);
    console.log(`Event with location tracked: ${eventKeyword}`);
  } catch (error) {
    console.error('Failed to track event with location:', error);
  }
};

// Example 12: Complete analytics setup for app startup
export const setupAnalytics = async () => {
  try {
    // Initialize analytics service
    await initializeAnalytics();
    
    // Track app session start
    await trackAppSession();
    
    // Check if this is first launch and track install
    const isFirstLaunch = await checkIfFirstLaunch(); // You need to implement this
    if (isFirstLaunch) {
      await trackAppInstall();
    }
    
    console.log('Analytics setup completed');
  } catch (error) {
    console.error('Failed to setup analytics:', error);
  }
};

// Helper function to check if this is the first launch
const checkIfFirstLaunch = async () => {
  // This is a placeholder - you should implement this using StorageService
  // to check if the app has been launched before
  return false;
};
