// Polyfills for missing browser APIs

// TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}

// URLSearchParams
import { URLSearchParams } from 'url';
if (typeof global.URLSearchParams === 'undefined') {
    global.URLSearchParams = URLSearchParams;
}

// DOM APIs
import DOMException from 'domexception';
if (typeof global.DOMException === 'undefined') {
    global.DOMException = DOMException;
}

// Crypto
import crypto from 'crypto';
if (typeof global.crypto === 'undefined') {
    global.crypto = {
        getRandomValues: function (array) {
            return crypto.randomFillSync(array);
        }
    };
}

// Performance
if (typeof global.performance === 'undefined') {
    global.performance = {
        now: () => Date.now(),
        timeOrigin: Date.now()
    };
}

// Fetch
import fetch from 'node-fetch';
if (typeof global.fetch === 'undefined') {
    global.fetch = fetch;
    global.Headers = fetch.Headers;
    global.Request = fetch.Request;
    global.Response = fetch.Response;
}

// XMLHttpRequest
import XMLHttpRequest from 'xmlhttprequest';
if (typeof global.XMLHttpRequest === 'undefined') {
    global.XMLHttpRequest = XMLHttpRequest;
}
