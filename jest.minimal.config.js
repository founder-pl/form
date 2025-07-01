// Minimal Jest configuration for testing ESM support
export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  // Disable setup files for now
  setupFiles: [],
  setupFilesAfterEnv: [],
  // Disable coverage for minimal testing
  collectCoverage: false,
  // Disable transform for node_modules
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  // Verbose output
  verbose: true
};
