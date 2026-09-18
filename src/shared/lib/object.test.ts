import { describe, expect, it } from 'vitest';
import { safeGet, deepMerge } from './object';

describe('object utils', () => {
    it('safeGet', () => {
        const data = { a: { b: { c: 10 } } };
        expect(safeGet<number>(data, 'a.b.c', -1)).toBe(10);
        expect(safeGet<number>(data, 'a.x.c', -1)).toBe(-1);
    });

    it('deepMerge (simple)', () => {
        const a = { a: 1, nested: { x: 1 } };
        const b = { b: 2, nested: { y: 2 } };
        expect(deepMerge(a, b)).toEqual({ a: 1, b: 2, nested: { x: 1, y: 2 } });
    });
});
