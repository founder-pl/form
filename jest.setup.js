// Setup file for Jest tests
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder and TextDecoder to global scope for JSDOM
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock any global objects or functions needed for testing
global.console = {
  ...console,
  // Override console methods if needed
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Add any other global setup code here
