// Jest ESM configuration
// This configuration is specifically for running tests with ES modules

export default {
  // Use Node environment with ESM support
  testEnvironment: 'node',
  
  // Setup files - using consolidated setup
  setupFiles: ['<rootDir>/src/__tests__/setup.js'],
  
  // Handle ES modules
  preset: 'ts-jest/presets/default-esm',
  
  // Module handling
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.m?js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }]
  },
  
  // Test paths
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|figlet|commander|cli-table3|@babel/runtime|@testing-library)/)'
  ],
  
  // Global configuration
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
