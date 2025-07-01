// Import Jest's globals explicitly for ESM
import { jest } from '@jest/globals';

global.jest = jest;
global.test = test;
global.expect = expect;
global.describe = describe;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
