import { describe, expect, it } from 'vitest';
import { isEmpty, normalizeNumber } from './string';

describe('string utils', () => {
    it('isEmpty', () => {
        expect(isEmpty('')).toBe(true);
        expect(isEmpty('   ')).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('hi')).toBe(false);
    });

    it('normalizeNumber', () => {
        expect(normalizeNumber(' 1 299,90 ')).toBe(1299.90);
        expect(normalizeNumber('42')).toBe(42);
        expect(normalizeNumber('')).toBeNull();
        expect(normalizeNumber('abc')).toBeNull();
    });
});
