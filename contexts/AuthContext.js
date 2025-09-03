import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services';
import storageService from '../services/StorageService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [storageAvailable, setStorageAvailable] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if storage is available
        const storageWorking = await storageService.isStorageWorking();
        setStorageAvailable(storageWorking);
        
        if (!storageWorking) {
          console.warn('Storage not available, authentication will not persist');
        }

        // Initialize API service
        await apiService.initialize();
        
        if (apiService.isUserAuthenticated()) {
          // User is authenticated, get their data
          await loadUserData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load user data from API
  const loadUserData = async () => {
    try {
      const [profileResponse, rolesResponse, permissionsResponse] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getUserRoles(),
        apiService.getUserPermissions(),
      ]);

      if (profileResponse.success) {
        setUser(profileResponse.data.user);
        setIsAuthenticated(true);
      }

      if (rolesResponse.success) {
        setUserRoles(rolesResponse.data.roles);
      }

      if (permissionsResponse.success) {
        setUserPermissions(permissionsResponse.data.permissions);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // If there's an error loading user data, logout
      await logout();
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Only try to store data if storage is available
        if (storageAvailable) {
          try {
            await storageService.storeAuthToken(response.data.token);
            await storageService.storeUserProfile(response.data.user);
            
            // Set token expiry (assuming 24 hours if not provided)
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + 24);
            await storageService.storeTokenExpiry(expiry);
          } catch (storageError) {
            console.warn('Failed to store auth data:', storageError);
          }
        }
        
        // Load additional user data
        await loadUserData();
        
        return { success: true, user: response.data.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      setUserRoles([]);
      setUserPermissions([]);
      
      // Try to clear stored data if storage is available
      if (storageAvailable) {
        try {
          await storageService.clearAuthData();
        } catch (storageError) {
          console.warn('Failed to clear stored auth data:', storageError);
        }
      }
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => userPermissions.includes(permission));
  };

  // Get user's highest role level
  const getHighestRoleLevel = () => {
    if (userRoles.length === 0) return 1;
    
    const maxLevel = Math.max(...userRoles.map(role => role.level));
    return maxLevel;
  };

  // Check if user has specific role
  const hasRole = (roleName) => {
    return userRoles.some(role => role.name === roleName);
  };

  // Check if user is admin (level 4)
  const isAdmin = () => {
    return getHighestRoleLevel() >= 4;
  };

  // Check if user is sector admin (level 3)
  const isSectorAdmin = () => {
    return getHighestRoleLevel() >= 3;
  };

  // Check if user is property owner (level 2)
  const isPropertyOwner = () => {
    return getHighestRoleLevel() >= 2;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    userRoles,
    userPermissions,
    storageAvailable,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getHighestRoleLevel,
    hasRole,
    isAdmin,
    isSectorAdmin,
    isPropertyOwner,
    loadUserData, // Expose for manual refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
