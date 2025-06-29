
export default {
  // Custom test environment loads JSDOM + high-level browser mocks
  testEnvironment: '<rootDir>/test/environment.js',

  // Low-level polyfills that MUST run before anything else (e.g. TextEncoder)
  setupFiles: ['<rootDir>/test/jest.setup.js'],

  // Additional setup that needs browser globals to exist
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],

  // Map static resources and alias @/* to project root
  moduleNameMapper: {
    '^\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1'
  },

  transformIgnorePatterns: ['/node_modules/(?!(bootstrap|bootstrap-icons)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'json', 'node'],

  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/app.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // Test discovery
  testMatch: ['**/test/**/*.test.js'],
  verbose: true
};
