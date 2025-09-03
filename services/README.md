# GU API Service - Privilege System

A comprehensive API service for managing user authentication, roles, permissions, geographic sectors, and properties in the Glotón Urbano application.

## Overview

This service implements a hierarchical role-based access control (RBAC) system with four main user levels:
- **Regular App Users** (Level 1) - Basic application access
- **Property Owners** (Level 2) - Manage their own properties
- **Sector Administrators** (Level 3) - Manage geographic sectors
- **System Administrators** (Level 4) - Full system access

## Architecture

The service is built with a layered architecture:

```
services/
├── ApiService.js          # Base API service with core functionality
├── EnhancedApiService.js  # Enhanced service with storage integration
├── StorageService.js      # Local storage management
├── config.js             # Environment configuration
├── usage-example.js      # Usage examples
├── index.js              # Service exports
└── README.md             # This file
```

## Features

### 🔐 Authentication
- User registration and login
- Password reset flow
- Token-based authentication with Laravel Sanctum
- Automatic token refresh
- Secure token storage

### 👤 User Management
- Profile management
- Role and permission management
- Password change functionality
- User data caching

### 🗺️ Geographic Data
- Sector management
- Property management
- Location-based filtering
- Permission-based access control

### 💾 Data Persistence
- Local token storage
- User profile caching
- Offline data access
- Automatic data synchronization

### 🛡️ Security
- Input validation
- Password strength validation
- Token expiration handling
- Secure error handling

## Installation

The service requires the following dependencies:

```bash
npm install @react-native-async-storage/async-storage
```

## Quick Start

### Basic Usage

```javascript
import apiService from './services';

// Initialize the service
await apiService.initialize();

// Login user
const loginResponse = await apiService.login({
  email: 'user@example.com',
  password: 'password123',
  device_name: 'iPhone 14'
});

// Get user profile
const profile = await apiService.getUserProfile();

// Check permissions
const canViewProperties = await apiService.hasPermission('view_properties');

// List properties
const properties = await apiService.listProperties();
```

### Advanced Usage

```javascript
import { EnhancedApiService, config } from './services';

// Configure for different environments
config.setBaseURL('https://staging-api.gu-system.com/api/v1');

// Complete workflow
const workflow = async () => {
  // Initialize
  await apiService.initialize();
  
  // Check authentication
  if (apiService.isUserAuthenticated()) {
    // Get cached profile
    const profile = await apiService.getUserProfile();
    
    // Check permissions
    const permissions = await apiService.getUserPermissions();
    
    // Get data based on permissions
    if (await apiService.hasPermission('view_sectors')) {
      const sectors = await apiService.listSectors();
    }
  } else {
    // Login required
    await apiService.login(credentials);
  }
};
```

## API Reference

### Authentication Methods

#### `login(credentials)`
Authenticate user and store token automatically.

```javascript
const response = await apiService.login({
  email: 'user@example.com',
  password: 'password123',
  device_name: 'iPhone 14',
  remember: true
});
```

#### `register(userData)`
Register a new user account.

```javascript
const response = await apiService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePassword123!',
  password_confirmation: 'SecurePassword123!',
  device_name: 'iPhone 14',
  terms_accepted: true
});
```

#### `logout()`
Logout user and clear all stored data.

```javascript
const response = await apiService.logout();
```

#### `forgotPassword(email)`
Request password reset email.

```javascript
const response = await apiService.forgotPassword('user@example.com');
```

#### `resetPassword(resetData)`
Reset password using token.

```javascript
const response = await apiService.resetPassword({
  email: 'user@example.com',
  token: 'reset_token',
  password: 'NewPassword123!',
  password_confirmation: 'NewPassword123!'
});
```

### User Management Methods

#### `getUserProfile(forceRefresh = false)`
Get user profile with optional caching.

```javascript
// Use cached data
const profile = await apiService.getUserProfile();

// Force refresh from API
const profile = await apiService.getUserProfile(true);
```

#### `updateUserProfile(profileData)`
Update user profile.

```javascript
const response = await apiService.updateUserProfile({
  name: 'John Smith',
  email: 'john.smith@example.com'
});
```

#### `getUserRoles(forceRefresh = false)`
Get user roles with optional caching.

```javascript
const roles = await apiService.getUserRoles();
```

#### `getUserPermissions(forceRefresh = false)`
Get user permissions with optional caching.

```javascript
const permissions = await apiService.getUserPermissions();
```

#### `hasPermission(permission)`
Check if user has specific permission.

```javascript
const canViewProperties = await apiService.hasPermission('view_properties');
```

#### `hasAnyPermission(permissions)`
Check if user has any of the specified permissions.

```javascript
const hasAdminAccess = await apiService.hasAnyPermission([
  'admin_access',
  'system_admin'
]);
```

#### `hasAllPermissions(permissions)`
Check if user has all of the specified permissions.

```javascript
const hasFullAccess = await apiService.hasAllPermissions([
  'view_properties',
  'edit_properties',
  'delete_properties'
]);
```

### Geographic Data Methods

#### `listSectors(params = {})`
List sectors with optional filtering.

```javascript
// Get all sectors
const sectors = await apiService.listSectors();

// Get active sectors with property count
const activeSectors = await apiService.listSectors({
  active: true,
  include: 'properties_count'
});
```

#### `getSector(sectorId, params = {})`
Get sector details.

```javascript
const sector = await apiService.getSector(1, {
  include: 'properties_count,users_count'
});
```

#### `listProperties(params = {})`
List properties with optional filtering.

```javascript
// Get all properties
const properties = await apiService.listProperties();

// Get properties in specific sector
const sectorProperties = await apiService.listProperties({
  sector_id: 1,
  status: 'active',
  include: 'sector,owner'
});
```

#### `getProperty(propertyId, params = {})`
Get property details.

```javascript
const property = await apiService.getProperty(1, {
  include: 'sector,owner'
});
```

### Utility Methods

#### `isUserAuthenticated()`
Check if user is currently authenticated.

```javascript
const isAuthenticated = apiService.isUserAuthenticated();
```

#### `validateEmail(email)`
Validate email format.

```javascript
const isValid = apiService.validateEmail('user@example.com');
```

#### `validatePassword(password)`
Validate password strength.

```javascript
const validation = apiService.validatePassword('SecurePassword123!');
console.log(validation.isValid); // true/false
console.log(validation.details); // Detailed validation results
```

## Configuration

### Environment Configuration

The service automatically detects the environment and configures accordingly:

```javascript
// Development
baseURL: 'http://localhost:8000/api/v1'
timeout: 10000
retryAttempts: 3

// Staging
baseURL: 'https://staging-api.gu-system.com/api/v1'
timeout: 15000
retryAttempts: 3

// Production
baseURL: 'https://api.gu-system.com/api/v1'
timeout: 20000
retryAttempts: 2
```

### Custom Configuration

```javascript
import { config } from './services';

// Set custom base URL
config.baseURL = 'https://custom-api.com/api/v1';

// Set custom timeout
config.timeout = 30000;
```

## Error Handling

The service provides comprehensive error handling:

```javascript
try {
  const response = await apiService.login(credentials);
  // Handle success
} catch (error) {
  // Handle specific error types
  if (error.message.includes('401')) {
    // Authentication error
    console.log('Invalid credentials');
  } else if (error.message.includes('422')) {
    // Validation error
    console.log('Validation failed:', error.errors);
  } else {
    // General error
    console.log('Unexpected error:', error.message);
  }
}
```

## Storage Management

The service automatically manages local storage:

- **Authentication tokens** - Stored securely with expiration
- **User profiles** - Cached for offline access
- **User roles** - Cached for permission checks
- **User permissions** - Cached for access control

### Manual Storage Management

```javascript
import { StorageService } from './services';

// Clear all authentication data
await StorageService.clearAuthData();

// Get storage information
const info = await StorageService.getStorageInfo();
console.log('Total keys:', info.totalKeys);
```

## Best Practices

### 1. Initialize Early
Always initialize the service early in your app lifecycle:

```javascript
// In App.js or similar
import apiService from './services';

const App = () => {
  useEffect(() => {
    apiService.initialize();
  }, []);
  
  // ... rest of app
};
```

### 2. Handle Authentication State
Check authentication status before making requests:

```javascript
if (apiService.isUserAuthenticated()) {
  // Make authenticated requests
} else {
  // Redirect to login
}
```

### 3. Use Permission Checks
Always check permissions before accessing sensitive data:

```javascript
if (await apiService.hasPermission('view_properties')) {
  const properties = await apiService.listProperties();
} else {
  // Show access denied message
}
```

### 4. Implement Error Boundaries
Wrap API calls in try-catch blocks:

```javascript
try {
  const data = await apiService.getUserProfile();
} catch (error) {
  // Handle error appropriately
  console.error('API Error:', error);
}
```

### 5. Use Caching Wisely
Leverage the built-in caching for better performance:

```javascript
// Use cached data for better UX
const profile = await apiService.getUserProfile();

// Force refresh when needed
const freshProfile = await apiService.getUserProfile(true);
```

## Troubleshooting

### Common Issues

1. **Token Expired**
   - The service automatically handles token refresh
   - If refresh fails, user will be logged out

2. **Network Errors**
   - Check internet connectivity
   - Verify API endpoint configuration

3. **Permission Denied**
   - Verify user has required permissions
   - Check role assignments

4. **Storage Issues**
   - Clear app data if storage is corrupted
   - Check AsyncStorage permissions

### Debug Mode

Enable debug logging:

```javascript
// Add to your app initialization
if (__DEV__) {
  console.log('API Service initialized');
  console.log('Base URL:', config.baseURL);
}
```

## Contributing

When contributing to this service:

1. Follow the existing code structure
2. Add comprehensive JSDoc comments
3. Include error handling for all methods
4. Update the usage examples
5. Test with different user roles and permissions

## License

This service is part of the Glotón Urbano application and follows the same license terms.
