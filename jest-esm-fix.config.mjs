// Simplified Jest config for ESM support
export default {
  // Use jsdom environment for browser-like testing
  testEnvironment: 'jsdom',
  
  // Setup files - using the setup file we modified
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  
  // Handle ES modules
  transform: {},
  
  // Module handling
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // File extensions to test
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // Test paths
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(bootstrap|bootstrap-icons|chalk|cli-table3|figlet)/)'
  ],
  
  // Test configuration
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // Coverage settings (temporarily disabled)
  collectCoverage: false,
  
  // Global test timeout
  testTimeout: 30000,
  
  // Transform configuration for ESM
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
