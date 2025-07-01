// Polyfills for Node.js environment
import { TextEncoder, TextDecoder } from 'node:util';

// Add TextEncoder and TextDecoder to global scope
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Mock console methods
const originalConsole = { ...console };

// Define mock console methods using globalThis
globalThis.console = {
  ...originalConsole,
  error: jest.fn(originalConsole.error),
  warn: jest.fn(originalConsole.warn),
  info: jest.fn(originalConsole.info),
  debug: jest.fn(originalConsole.debug),
  log: jest.fn(originalConsole.log),
};

// Setup global test timeout
globalThis.jest = globalThis.jest || {};
globalThis.jest.setTimeout = (timeout) => {
  // No-op in browser environment
};

// Setup test environment
const setupTestEnvironment = () => {
  // Set test timeout
  jest.setTimeout(10000);

  // Reset mocks before each test
  if (typeof beforeEach === 'function') {
    beforeEach(() => {
      if (typeof jest !== 'undefined') {
        jest.clearAllMocks();
      }
      // Reset any custom global state here
      globalThis.__TEST__ = true;
    });
  }

  // Cleanup after all tests
  if (typeof afterAll === 'function') {
    afterAll(() => {
      // Restore original console methods
      globalThis.console = originalConsole;
    });
  }
};

// Initialize test environment
setupTestEnvironment();
