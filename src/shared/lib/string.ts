export function isEmpty(s: string | null | undefined): boolean {
    return s == null || s.trim() === '';
}

export function normalizeNumber(str: string): number | null {
    const cleaned = str
        .trim()
        .replace(/\s+/g, '')
        .replace(',', '.');

    if (cleaned === '' || cleaned === '.' || cleaned === '-' || Number.isNaN(Number(cleaned))) {
        return null;
    }
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
}