
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

  transformIgnorePatterns: ['/node_modules/(?!(bootstrap|bootstrap-icons|chalk|cli-table3|figlet)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/test/'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  modulePaths: ['<rootDir>/node_modules', '<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js',
    '!src/**/*.stories.js',
    '!src/**/setupTests.js',
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
