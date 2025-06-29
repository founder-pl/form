/**
 * Tests for hintService.js
 * Run with: npm test
 */

import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

// Import the module we want to test
const hintServiceModule = await import('../../js/services/hintService.js');
const hintService = hintServiceModule.default;

// Mock data
const mockCountryData = {
    PL: { name: 'Poland', eu: true, currency: 'PLN' },
    DE: { name: 'Germany', eu: true, currency: 'EUR' },
    US: { name: 'United States', eu: false, currency: 'USD' }
};

// Mock the dataService
const mockGetCountryData = jest.fn(countryCode => mockCountryData[countryCode] || null);

// Mock the dataService module
jest.unstable_mockModule('../../js/services/dataService.js', () => ({
    __esModule: true,
    default: {
        getCountryData: mockGetCountryData
    }
}));

// Set up DOM
beforeAll(() => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <head></head>
        <body>
            <div id="app">
                <table id="results">
                    <thead>
                        <tr>
                            <th data-column="country">Country</th>
                            <th data-column="business-type">Business Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr data-country="PL">
                            <td class="country-name" data-country="PL">Poland</td>
                            <td>Service</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `);

    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
});

// Test suite
describe('hintService', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Set up fetch mock
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    countries: {
                        PL: {
                            name: 'Poland',
                            description: 'Test description',
                            taxTips: ['Test tip 1', 'Test tip 2'],
                            benefits: ['Test benefit 1']
                        }
                    },
                    columns: {
                        'business-type': 'Test business type hint'
                    }
                })
            })
        );
    });
    
    describe('loadHints', () => {
        it('should load hints from URL and merge with defaults', async () => {
            const hints = await hintService.loadHints('/test/hints.json');
            
            expect(hints).toBeDefined();
            expect(hints.countries.PL).toBeDefined();
            expect(hints.columns['business-type']).toBe('Test business type hint');
            expect(fetch).toHaveBeenCalledWith('/test/hints.json');
        });
        
        it('should use default hints when loading fails', async () => {
            // Mock fetch to reject
            global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
            
            const hints = await hintService.loadHints('/test/hints.json');
            
            expect(hints).toBeDefined();
            expect(hints.countries.PL).toBeDefined(); // Default hints should be present
        });
    });
    
    describe('getCountryHints', () => {
        it('should return hints for a known country', () => {
            const hints = hintService.getCountryHints('PL');
            
            expect(hints).toBeDefined();
            expect(hints.name).toBe('Poland');
            expect(Array.isArray(hints.taxTips)).toBe(true);
            expect(Array.isArray(hints.benefits)).toBe(true);
        });
        
        it('should return null for unknown country', () => {
            const hints = hintService.getCountryHints('XX');
            expect(hints).toBeNull();
        });
        
        it('should merge default hints with country data', () => {
            const hints = hintService.getCountryHints('DE');
            
            expect(hints).toBeDefined();
            expect(hints.name).toBe('Germany');
            expect(hints.currency).toBe('EUR');
        });
    });
    
    describe('getColumnHint', () => {
        it('should return hint for known column', () => {
            const hint = hintService.getColumnHint('business-type');
            expect(hint).toBe('Test business type hint');
        });
        
        it('should return empty string for unknown column', () => {
            const hint = hintService.getColumnHint('nonexistent-column');
            expect(hint).toBe('');
        });
    });
    
    describe('createHelpIcon', () => {
        it('should create a help icon with tooltip', () => {
            const hint = 'This is a test hint';
            const icon = hintService.createHelpIcon(hint);
            
            expect(icon).toBeDefined();
            expect(icon.tagName).toBe('I');
            expect(icon.getAttribute('data-bs-toggle')).toBe('tooltip');
            expect(icon.getAttribute('title')).toBe(hint);
            expect(icon.className).toContain('bi-info-circle');
        });
    });
    
    describe('initializeTooltips', () => {
        it('should initialize Bootstrap tooltips', () => {
            // Add an element with data-bs-toggle="tooltip"
            const element = document.createElement('div');
            element.setAttribute('data-bs-toggle', 'tooltip');
            element.title = 'Test tooltip';
            document.body.appendChild(element);
            
            hintService.initializeTooltips();
            
            expect(global.bootstrap.Tooltip).toHaveBeenCalled();
            document.body.removeChild(element);
        });
    });
    
    describe('addTableHeaderHelp', () => {
        it('should add help icons to table headers', () => {
            hintService.addTableHeaderHelp('results');
            
            const headers = document.querySelectorAll('th[data-column]');
            headers.forEach(header => {
                const icon = header.querySelector('.bi-info-circle');
                expect(icon).not.toBeNull();
            });
        });
    });
    
    describe('showCountryInfoModal', () => {
        it('should create and show a modal with country info', () => {
            hintService.showCountryInfoModal('PL');
            
            // Check if modal was created
            const modal = document.getElementById('countryInfoModal');
            expect(modal).not.toBeNull();
            
            // Check if modal content was populated
            expect(modal.innerHTML).toContain('Poland');
            
            // Check if Bootstrap Modal was initialized
            expect(global.bootstrap.Modal).toHaveBeenCalled();
        });
    });
});

// Simple test runner for environments without Jest
if (typeof jest === 'undefined') {
    let passed = 0;
    let failed = 0;
    
    function describe(description, fn) {
        console.log(`\n${description}`);
        fn();
    }
    
    function it(description, fn) {
        try {
            fn();
            console.log(`  ✓ ${description}`);
            passed++;
        } catch (error) {
            console.error(`  ✗ ${description}`);
            console.error(`    ${error.message}`);
            failed++;
        }
    }
    
    // Mock Jest expect
    global.expect = (actual) => ({
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
            }
            return { not: { toBe: (notExpected) => {
                if (actual === notExpected) {
                    throw new Error(`Expected ${JSON.stringify(actual)} not to be ${JSON.stringify(notExpected)}`);
                }
            }}};
        },
        toBeDefined() {
            if (actual === undefined) {
                throw new Error('Expected value to be defined');
            }
            return { not: { toBeDefined: () => {
                if (actual !== undefined) {
                    throw new Error('Expected value to be undefined');
                }
            }}};
        },
        toContain(expected) {
            if (!actual.includes(expected)) {
                throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`);
            }
            return { not: { toContain: (notExpected) => {
                if (actual.includes(notExpected)) {
                    throw new Error(`Expected ${JSON.stringify(actual)} not to contain ${JSON.stringify(notExpected)}`);
                }
            }}};
        },
        toBeNull() {
            if (actual !== null) {
                throw new Error(`Expected ${JSON.stringify(actual)} to be null`);
            }
            return { not: { toBeNull: () => {
                if (actual === null) {
                    throw new Error('Expected value not to be null');
                }
            }}};
        },
        toBeTruthy() {
            if (!actual) {
                throw new Error(`Expected ${JSON.stringify(actual)} to be truthy`);
            }
            return { not: { toBeTruthy: () => {
                if (actual) {
                    throw new Error(`Expected ${JSON.stringify(actual)} to be falsy`);
                }
            }}};
        },
        toHaveBeenCalled() {
            if (!actual.mock || typeof actual.mock.calls === 'undefined') {
                throw new Error('Expected a mock function');
            }
            if (actual.mock.calls.length === 0) {
                throw new Error('Expected the mock function to have been called');
            }
            return { not: { toHaveBeenCalled: () => {
                if (actual.mock.calls.length > 0) {
                    throw new Error('Expected the mock function not to have been called');
                }
            }}};
        }
    });
    
    // Mock Jest functions
    global.jest = {
        fn: (impl) => {
            const mockFn = (...args) => {
                mockFn.mock.calls.push(args);
                return impl ? impl(...args) : undefined;
            };
            mockFn.mock = { calls: [] };
            return mockFn;
        },
        clearAllMocks: () => {}
    };
    
    // Run tests
    console.log('Running tests...');
    
    // Import the test file to execute tests
    require('./hintService.test.js');
    
    // Show summary
    console.log(`\nTests: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
}
