// CommonJS Jest configuration for testing
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.cjs'],
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|figlet|commander|cli-table3)/)',
  ],
  // Setup files
  setupFiles: [],
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/coverage/**',
  ],
  // Other options
  verbose: true,
  testTimeout: 10000,
};
