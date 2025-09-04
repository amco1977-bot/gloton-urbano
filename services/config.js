/**
 * API Configuration
 * Manages different environments and API settings
 */

const environments = {
  development: {
    baseURL: 'https://gu.mindware.com.mx/api/v1',
    timeout: 10000,
    retryAttempts: 3,
  },
  staging: {
    baseURL: 'https://gu.mindware.com.mx/api/v1',
    timeout: 15000,
    retryAttempts: 3,
  },
  production: {
    baseURL: 'https://gu.mindware.com.mx/api/v1',
    timeout: 20000,
    retryAttempts: 2,
  },
};

// Default to development environment
const currentEnvironment = __DEV__ ? 'development' : 'production';

export const config = {
  ...environments[currentEnvironment],
  environment: currentEnvironment,
  
  // Rate limiting settings
  rateLimits: {
    public: 60,      // requests per minute for public endpoints
    authenticated: 120, // requests per minute for authenticated endpoints
    admin: 300,      // requests per minute for admin endpoints
  },
  
  // Authentication settings
  auth: {
    tokenKey: 'gu_auth_token',
    refreshTokenKey: 'gu_refresh_token',
    tokenExpiryKey: 'gu_token_expiry',
  },
  
  // API endpoints
  endpoints: {
    auth: {
      register: '/register',
      login: '/login',
      logout: '/logout',
      forgotPassword: '/forgot-password',
      resetPassword: '/reset-password',
      verifyResetToken: '/verify-reset-token',
      refresh: '/refresh',
    },
    user: {
      profile: '/user',
      roles: '/user/roles',
      permissions: '/user/permissions',
      changePassword: '/change-password',
    },
    geographic: {
      sectors: '/sectors',
      properties: '/properties',
    },
  },
};

export default config;
