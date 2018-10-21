import normalizePath from './normalizePath';
import { truncateSync } from 'fs';

describe('Test of normalizePath function', () => {
    it('Windows directory separator.', () => {
        expect(normalizePath('\\aaa\\bbb\\ccc')).toBe('/aaa/bbb/ccc');
    })
});