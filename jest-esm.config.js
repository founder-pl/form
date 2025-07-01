// Jest ESM configuration
// This configuration is specifically for running tests with ES modules

export default {
  // Use Node environment
  testEnvironment: 'node',
  
  // Setup files
  setupFiles: ['<rootDir>/src/__tests__/global-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Handle ES modules
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|figlet|commander|cli-table3)/)',
  ],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  
  // Coverage settings (temporarily disabled)
  collectCoverage: false,
  
  // Other settings
  verbose: true,
  testTimeout: 10000,
};
