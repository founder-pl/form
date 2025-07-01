// Setup file for Jest tests
import { TextEncoder, TextDecoder } from 'node:util';
import { jest } from '@jest/globals';

// Add TextEncoder and TextDecoder to global scope
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Mock any global objects or functions needed for testing
const consoleMocks = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Only override console methods in test environment
if (process.env.NODE_ENV === 'test') {
  globalThis.console = {
    ...console,
    ...consoleMocks,
  };
}

// Global test setup
global.beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Reset any global state here
});

// Global test teardown
global.afterAll(() => {
  // Clean up any global state here
});
