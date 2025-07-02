// ESM-compatible global setup
import { jest, test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

// Assign to global scope
globalThis.jest = jest;
globalThis.test = test;
globalThis.expect = expect;
globalThis.describe = describe;
globalThis.beforeEach = beforeEach;
globalThis.afterEach = afterEach;
globalThis.beforeAll = beforeAll;
globalThis.afterAll = afterAll;
