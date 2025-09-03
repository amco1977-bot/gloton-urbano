/**
 * API Service Usage Examples
 * Demonstrates how to use the Enhanced API Service in different scenarios
 */

import enhancedApiService from './EnhancedApiService';

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

/**
 * Example: User Registration
 */
export const registerUserExample = async () => {
  try {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123!",
      password_confirmation: "SecurePassword123!",
      device_name: "iPhone 14",
      terms_accepted: true,
    };

    const response = await enhancedApiService.register(userData);
    
    if (response.success) {
      console.log('User registered successfully:', response.data.user);
      return response.data;
    } else {
      console.error('Registration failed:', response.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

/**
 * Example: User Login
 */
export const loginUserExample = async () => {
  try {
    const credentials = {
      email: "john@example.com",
      password: "SecurePassword123!",
      device_name: "iPhone 14",
      remember: true,
    };

    const response = await enhancedApiService.login(credentials);
    
    if (response.success) {
      console.log('Login successful:', response.data.user);
      console.log('Token stored automatically');
      return response.data;
    } else {
      console.error('Login failed:', response.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

/**
 * Example: Password Reset Flow
 */
export const passwordResetExample = async () => {
  try {
    // Step 1: Request password reset
    const forgotResponse = await enhancedApiService.forgotPassword("john@example.com");
    
    if (forgotResponse.success) {
      console.log('Password reset email sent');
      
      // Step 2: Verify reset token (when user clicks email link)
      const token = "abc123def456"; // This would come from the email
      const verifyResponse = await enhancedApiService.verifyResetToken("john@example.com", token);
      
      if (verifyResponse.success) {
        console.log('Token is valid');
        
        // Step 3: Reset password
        const resetData = {
          email: "john@example.com",
          token: token,
          password: "NewSecurePassword123!",
          password_confirmation: "NewSecurePassword123!",
        };
        
        const resetResponse = await enhancedApiService.resetPassword(resetData);
        
        if (resetResponse.success) {
          console.log('Password reset successful');
        }
      }
    }
  } catch (error) {
    console.error('Password reset error:', error);
  }
};

// ============================================================================
// USER MANAGEMENT EXAMPLES
// ============================================================================

/**
 * Example: Get User Profile
 */
export const getUserProfileExample = async () => {
  try {
    // This will use cached data if available, or fetch from API
    const response = await enhancedApiService.getUserProfile();
    
    if (response.success) {
      console.log('User profile:', response.data.user);
      return response.data.user;
    }
  } catch (error) {
    console.error('Get profile error:', error);
  }
};

/**
 * Example: Update User Profile
 */
export const updateProfileExample = async () => {
  try {
    const profileData = {
      name: "John Smith",
      email: "john.smith@example.com",
    };

    const response = await enhancedApiService.updateUserProfile(profileData);
    
    if (response.success) {
      console.log('Profile updated:', response.data.user);
      return response.data.user;
    }
  } catch (error) {
    console.error('Update profile error:', error);
  }
};

/**
 * Example: Change Password
 */
export const changePasswordExample = async () => {
  try {
    const passwordData = {
      current_password: "CurrentPassword123!",
      password: "NewSecurePassword123!",
      password_confirmation: "NewSecurePassword123!",
    };

    const response = await enhancedApiService.changePassword(passwordData);
    
    if (response.success) {
      console.log('Password changed successfully');
    }
  } catch (error) {
    console.error('Change password error:', error);
  }
};

// ============================================================================
// PERMISSION AND ROLE EXAMPLES
// ============================================================================

/**
 * Example: Check User Permissions
 */
export const checkPermissionsExample = async () => {
  try {
    // Get user permissions
    const permissionsResponse = await enhancedApiService.getUserPermissions();
    
    if (permissionsResponse.success) {
      const permissions = permissionsResponse.data.permissions;
      console.log('User permissions:', permissions);
      
      // Check specific permission
      const canViewProperties = await enhancedApiService.hasPermission('view_properties');
      console.log('Can view properties:', canViewProperties);
      
      // Check multiple permissions
      const hasAdminAccess = await enhancedApiService.hasAnyPermission([
        'admin_access',
        'system_admin'
      ]);
      console.log('Has admin access:', hasAdminAccess);
      
      // Check all required permissions
      const hasFullAccess = await enhancedApiService.hasAllPermissions([
        'view_properties',
        'edit_properties',
        'delete_properties'
      ]);
      console.log('Has full access:', hasFullAccess);
      
      // Get highest role level
      const roleLevel = await enhancedApiService.getHighestRoleLevel();
      console.log('Highest role level:', roleLevel);
    }
  } catch (error) {
    console.error('Permission check error:', error);
  }
};

/**
 * Example: Get User Roles
 */
export const getUserRolesExample = async () => {
  try {
    const response = await enhancedApiService.getUserRoles();
    
    if (response.success) {
      const roles = response.data.roles;
      console.log('User roles:', roles);
      
      // Check if user is a property owner
      const isPropertyOwner = roles.some(role => role.name === 'property_owner');
      console.log('Is property owner:', isPropertyOwner);
      
      // Check if user is a sector admin
      const isSectorAdmin = roles.some(role => role.name === 'sector_admin');
      console.log('Is sector admin:', isSectorAdmin);
    }
  } catch (error) {
    console.error('Get roles error:', error);
  }
};

// ============================================================================
// GEOGRAPHIC DATA EXAMPLES
// ============================================================================

/**
 * Example: List Sectors
 */
export const listSectorsExample = async () => {
  try {
    // Get all sectors
    const allSectorsResponse = await enhancedApiService.listSectors();
    
    if (allSectorsResponse.success) {
      console.log('All sectors:', allSectorsResponse.data.sectors);
    }
    
    // Get active sectors with property count
    const activeSectorsResponse = await enhancedApiService.listSectors({
      active: true,
      include: 'properties_count'
    });
    
    if (activeSectorsResponse.success) {
      console.log('Active sectors:', activeSectorsResponse.data.sectors);
    }
  } catch (error) {
    console.error('List sectors error:', error);
  }
};

/**
 * Example: Get Sector Details
 */
export const getSectorExample = async (sectorId) => {
  try {
    const response = await enhancedApiService.getSector(sectorId, {
      include: 'properties_count,users_count'
    });
    
    if (response.success) {
      console.log('Sector details:', response.data.sector);
      return response.data.sector;
    }
  } catch (error) {
    console.error('Get sector error:', error);
  }
};

/**
 * Example: List Properties
 */
export const listPropertiesExample = async () => {
  try {
    // Get all properties
    const allPropertiesResponse = await enhancedApiService.listProperties();
    
    if (allPropertiesResponse.success) {
      console.log('All properties:', allPropertiesResponse.data.properties);
    }
    
    // Get properties in specific sector
    const sectorPropertiesResponse = await enhancedApiService.listProperties({
      sector_id: 1,
      status: 'active',
      include: 'sector,owner'
    });
    
    if (sectorPropertiesResponse.success) {
      console.log('Sector properties:', sectorPropertiesResponse.data.properties);
    }
    
    // Get properties owned by specific user
    const userPropertiesResponse = await enhancedApiService.listProperties({
      owner_id: 1,
      include: 'sector'
    });
    
    if (userPropertiesResponse.success) {
      console.log('User properties:', userPropertiesResponse.data.properties);
    }
  } catch (error) {
    console.error('List properties error:', error);
  }
};

/**
 * Example: Get Property Details
 */
export const getPropertyExample = async (propertyId) => {
  try {
    const response = await enhancedApiService.getProperty(propertyId, {
      include: 'sector,owner'
    });
    
    if (response.success) {
      console.log('Property details:', response.data.property);
      return response.data.property;
    }
  } catch (error) {
    console.error('Get property error:', error);
  }
};

// ============================================================================
// UTILITY EXAMPLES
// ============================================================================

/**
 * Example: Validation
 */
export const validationExample = () => {
  // Email validation
  const email = "john@example.com";
  const isEmailValid = enhancedApiService.validateEmail(email);
  console.log('Email valid:', isEmailValid);
  
  // Password validation
  const password = "SecurePassword123!";
  const passwordValidation = enhancedApiService.validatePassword(password);
  console.log('Password validation:', passwordValidation);
};

/**
 * Example: Authentication Status
 */
export const authStatusExample = () => {
  const isAuthenticated = enhancedApiService.isUserAuthenticated();
  console.log('Is authenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    const token = enhancedApiService.getCurrentToken();
    console.log('Current token:', token ? 'Present' : 'Missing');
  }
};

/**
 * Example: Logout
 */
export const logoutExample = async () => {
  try {
    const response = await enhancedApiService.logout();
    
    if (response.success) {
      console.log('Logout successful');
      console.log('All local data cleared');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// ============================================================================
// COMPLETE WORKFLOW EXAMPLE
// ============================================================================

/**
 * Example: Complete User Workflow
 */
export const completeWorkflowExample = async () => {
  try {
    // 1. Initialize the service
    await enhancedApiService.initialize();
    
    // 2. Check if user is already authenticated
    if (enhancedApiService.isUserAuthenticated()) {
      console.log('User is already authenticated');
      
      // 3. Get user profile
      const profile = await getUserProfileExample();
      
      // 4. Check permissions
      await checkPermissionsExample();
      
      // 5. Get geographic data based on permissions
      if (await enhancedApiService.hasPermission('view_sectors')) {
        await listSectorsExample();
      }
      
      if (await enhancedApiService.hasPermission('view_properties')) {
        await listPropertiesExample();
      }
      
    } else {
      console.log('User not authenticated, proceeding to login');
      
      // 6. Login user
      await loginUserExample();
      
      // 7. Continue with authenticated workflow
      await completeWorkflowExample();
    }
    
  } catch (error) {
    console.error('Workflow error:', error);
  }
};

export default {
  registerUserExample,
  loginUserExample,
  passwordResetExample,
  getUserProfileExample,
  updateProfileExample,
  changePasswordExample,
  checkPermissionsExample,
  getUserRolesExample,
  listSectorsExample,
  getSectorExample,
  listPropertiesExample,
  getPropertyExample,
  validationExample,
  authStatusExample,
  logoutExample,
  completeWorkflowExample,
};
