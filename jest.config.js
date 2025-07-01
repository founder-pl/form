
export default {
  // Custom test environment loads JSDOM + high-level browser mocks
  // Test environment
  testEnvironment: 'node',
  
  // Setup files
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  
  // Module handling
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\.{1,2}/.*)\\.js$': '$1',
    '^(\.{1,2}/.*)\\.mjs$': '$1',
    '^(\.{1,2}/.*)\\.cjs$': '$1',
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.js', '.mjs'],
  
  // Transform configuration
  transform: {
    '^.+\\.m?js$': ['babel-jest', { rootMode: 'upward' }],
  },
  
  // Ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(bootstrap|bootstrap-icons|chalk|cli-table3|figlet)/)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/test/'
  ],
  
  // Module handling
  moduleFileExtensions: ['js', 'mjs', 'json', 'jsx', 'node'],
  
  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js',
    '!src/**/*.stories.js',
    '!src/**/setupTests.js',
    '!src/**/__mocks__/**',
    'js/**/*.js',
    '!js/app.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 50, 
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testMatch: ['**/src/__tests__/**/*.test.js', '**/test/**/*.test.js'],
  verbose: true
};
