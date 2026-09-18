
export function safeGet<T = unknown>(obj: unknown, path: string): T | undefined;
export function safeGet<T = unknown, F = unknown>(obj: unknown, path: string, fallback: F): T | F;
export function safeGet<T, F>(obj: unknown, path: string, fallback?: F) {
    if (obj == null) return fallback as F | undefined;
    const keys = path.split('.');
    let cur: any = obj;
    for (const k of keys) {
        if (cur == null || typeof cur !== 'object' || !(k in cur)) return fallback as F | undefined;
        cur = cur[k];
    }
    return cur as T;
}

type Plain = Record<string, unknown>;

export function deepMerge<A extends Plain, B extends Plain>(a: A, b: B): A & B {
    const out: Plain = { ...a };
    for (const [k, v] of Object.entries(b)) {
        if (isPlainObject(v) && isPlainObject(out[k])) {
            out[k] = deepMerge(out[k] as Plain, v as Plain);
        } else {

            out[k] = v;
        }
    }
    return out as A & B;
}

function isPlainObject(x: unknown): x is Plain {
    return typeof x === 'object' && x !== null && Object.getPrototypeOf(x) === Object.prototype;
}
