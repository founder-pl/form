// Consolidated test setup for ESM environment
import { TextEncoder, TextDecoder } from 'node:util';
import { JSDOM } from 'jsdom';

// Import Jest globals directly from @jest/globals
import { afterEach, jest } from '@jest/globals';

// Make afterEach available globally for test files
global.afterEach = afterEach;

// 1. Set up TextEncoder and TextDecoder
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// 2. Set up DOM environment for browser-like testing
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'http://localhost',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.DOMParser = dom.window.DOMParser;

// 3. Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// 4. Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

global.localStorage = localStorageMock;

// 5. Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

global.sessionStorage = sessionStorageMock;

// 6. Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// 7. Mock window methods
global.scrollTo = jest.fn();

// 8. Mock console methods with Jest spies
const originalConsole = { ...console };

global.console = {
  ...originalConsole,
  error: jest.fn(originalConsole.error),
  warn: jest.fn(originalConsole.warn),
  info: jest.fn(originalConsole.info),
  debug: jest.fn(originalConsole.debug),
  log: jest.fn(originalConsole.log),
};

// 9. Set test timeout
global.TEST_TIMEOUT = 30000; // 30 seconds

// 10. Cleanup after tests
afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();
  
  // Reset fetch mock
  if (global.fetch.mockClear) {
    global.fetch.mockClear();
  }
  
  // Reset localStorage and sessionStorage
  if (global.localStorage.clear) {
    global.localStorage.clear();
  }
  if (global.sessionStorage.clear) {
    global.sessionStorage.clear();
  }
});
