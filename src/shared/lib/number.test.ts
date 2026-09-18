import { describe, expect, it } from 'vitest';
import { sum, avg, clamp } from './number';


describe('number util', () => {
    it('sum', () => {
        expect(sum([1, 2, 3])).toBe(6);
        expect(sum([])).toBe(0);
    });

    it('avg ', () => {
        expect(avg([2, 4])).toBe(3)
        expect(avg([])).toBe(0)
        expect(avg([1, 2, 3])).toBe(2);
        expect(avg([0.1, 0.2])).toBeCloseTo(0.15, 10);
        expect(avg([])).toBe(0);
    });

    it('clamp', () => {
        expect(clamp(5, 1, 10)).toBe(5);
        expect(clamp(-1, 0, 3)).toBe(0);
        expect(clamp(99, 0, 3)).toBe(3);
        expect(clamp(5, 10, 1)).toBe(5);
    });
});