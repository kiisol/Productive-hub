export function sum(arr: number[]): number {
    return arr.reduce((acc, n) => acc + n, 0);
}

export function avg(arr: number[]): number {
    if (arr.length === 0) return 0;
    return sum(arr) / arr.length;
}

export function clamp(n: number, min: number, max: number): number {
    if (min > max) [min, max] = [max, min];
    return Math.min(Math.max(n, min), max);
}