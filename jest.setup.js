// Setup file for Jest tests
import { TextEncoder, TextDecoder } from 'node:util';

// Add TextEncoder and TextDecoder to global scope
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Mock console methods in test environment
if (process.env.NODE_ENV === 'test') {
  // Mock console methods using the global jest object
  global.console = {
    ...console,
    error: jest.fn(console.error),
    warn: jest.fn(console.warn),
    info: jest.fn(console.info),
    debug: jest.fn(console.debug),
  };
}

// Note: We don't need to define beforeEach/afterEach here
// as they should be defined within the test files themselves
