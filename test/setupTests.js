import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder and TextDecoder to global scope
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Create a basic DOM environment
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'http://localhost',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true
});

// Set up global browser-like environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.DOMParser = dom.window.DOMParser;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.HTMLElement = dom.window.HTMLElement;

global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  })
);

// Mock window methods
window.scrollTo = jest.fn();
window.alert = jest.fn();
window.confirm = jest.fn();
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));

// Mock Bootstrap
global.bootstrap = {
  Tooltip: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn()
  })),
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn(),
    _element: document.createElement('div')
  })),
  Toast: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn()
  }))
};

// Mock console methods
const originalConsole = { ...console };
global.console = {
  ...originalConsole,
  log: jest.fn(originalConsole.log),
  warn: jest.fn(originalConsole.warn),
  error: jest.fn(originalConsole.error),
  info: jest.fn(originalConsole.info),
  debug: jest.fn(originalConsole.debug)
};

// Add a global teardown function
afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
  
  // Reset mocks
  global.fetch.mockClear();
  
  // Reset localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Reset all mocks
  jest.clearAllMocks();
});

// Add a global mock for the hint service
jest.unstable_mockModule('../../js/services/hintService.js', () => ({
  __esModule: true,
  default: {
    loadHints: jest.fn().mockResolvedValue({}),
    getCountryHints: jest.fn(),
    getColumnHint: jest.fn(),
    initializeTooltips: jest.fn(),
    createHelpIcon: jest.fn(),
    addTableHeaderHelp: jest.fn(),
    showCountryInfoModal: jest.fn()
  }
}));
