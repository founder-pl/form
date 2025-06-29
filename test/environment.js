import { JSDOM } from 'jsdom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { URLSearchParams } from 'url';
import DOMException from 'domexception';
import crypto from 'crypto';
import fetch from 'node-fetch';
import XMLHttpRequest from 'xmlhttprequest';

export default class CustomTestEnvironment {
    constructor(config) {
        this.config = config;
        this.global = null;
    }

    async setup() {
        // Create JSDOM environment
        const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
            url: 'http://localhost',
            runScripts: 'dangerously',
            resources: 'usable',
            pretendToBeVisual: true
        });

        this.global = dom.window;

        // Add polyfills to the global scope
        this.global.TextEncoder = TextEncoder;
        this.global.TextDecoder = TextDecoder;
        this.global.URLSearchParams = URLSearchParams;
        this.global.DOMException = DOMException;
        this.global.crypto = {
            getRandomValues: function (array) {
                return crypto.randomFillSync(array);
            }
        };
        this.global.performance = {
            now: () => Date.now(),
            timeOrigin: Date.now()
        };
        this.global.fetch = fetch;
        this.global.Headers = fetch.Headers;
        this.global.Request = fetch.Request;
        this.global.Response = fetch.Response;
        this.global.XMLHttpRequest = XMLHttpRequest;

        // Add other necessary browser globals
        this.global.window = dom.window;
        this.global.document = dom.window.document;
        this.global.navigator = dom.window.navigator;
        this.global.DOMParser = dom.window.DOMParser;
        this.global.Node = dom.window.Node;
        this.global.Element = dom.window.Element;
        this.global.HTMLElement = dom.window.HTMLElement;

        // Add requestAnimationFrame polyfill
        this.global.requestAnimationFrame = (callback) => {
            return setTimeout(callback, 0);
        };

        this.global.cancelAnimationFrame = (id) => {
            clearTimeout(id);
        };

        // Add localStorage and sessionStorage mocks
        const localStorageMock = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => {
                    store[key] = value.toString();
                },
                removeItem: (key) => {
                    delete store[key];
                },
                clear: () => {
                    store = {};
                }
            };
        })();

        this.global.localStorage = localStorageMock;
        this.global.sessionStorage = localStorageMock;

        // Add matchMedia polyfill
        this.global.matchMedia = (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        });
    }

    async teardown() {
        this.global = null;
    }

    runScript(script) {
        return this.global.eval(script);
    }
}
