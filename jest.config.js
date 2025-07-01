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
    '^(\.{1,2}/.*)\\.js$': '$1',
    '^(\.{1,2}/.*)\\.mjs$': '$1',
    '^(\.{1,2}/.*)\\.cjs$': '$1',
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'json', 'node'],
  
  // Transform configuration
  transform: {
    '^.+\\.m?js$': ['babel-jest', { 
      rootMode: 'upward',
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' },
          modules: 'commonjs',
          useBuiltIns: 'usage',
          corejs: 3,
        }]
      ]
    }],
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
  
  // Test configuration
  testMatch: ['**/src/__tests__/**/*.test.js'],
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js',
    '!src/**/*.stories.js',
    '!src/**/setupTests.js',
    '!src/**/__mocks__/**',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  
  // Other settings
  verbose: true,
  testTimeout: 10000
};
