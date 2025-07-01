// Jest ESM configuration
// This configuration is specifically for running tests with ES modules

export default {
  // Test environment
  testEnvironment: 'node',
  
  // Setup files
  setupFiles: ['<rootDir>/jest.setup.js'],
  
  // Module handling
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.m?js$': ['babel-jest'],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(bootstrap|bootstrap-icons|chalk|cli-table3|figlet)/)',
  ],
  
  // Test configuration
  testMatch: ['**/src/__tests__/**/*.test.js'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  
  // Coverage settings (temporarily disabled)
  collectCoverage: false,
  
  // Other settings
  verbose: true,
  testTimeout: 10000,
};
