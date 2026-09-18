// src/shared/api/http.ts

export type HttpError = {
    code: number | 'NETWORK_ERROR' | 'TIMEOUT';
    message: string;
};

export type RetryOptions = {
    retries?: number;
    retryDelay?: number;
    retryOnMethods?: Array<'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>;
};

export type HttpOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown; // JSON body
    timeout?: number; // milliseconds, 10000 by default
    signal?: AbortSignal; // external cancellation, for example from React
    withAuth?: boolean; // true by default
    retry?: RetryOptions; // retry settings
};

const DEFAULT_RETRY: Required<RetryOptions> = {
    retries: 2,
    retryDelay: 300,
    retryOnMethods: ['GET', 'HEAD'],
};

function getAuthToken(): string | null {
    try {
        return localStorage.getItem('auth_token');
    } catch {
        return null;
    }
}

function shouldRetry(err: HttpError | { code?: number | string }, status?: number): boolean {
    if (status) {
        if (status === 429) return true;
        if (status >= 502 && status <= 504) return true; // bad gateway / gateway timeout / service unavailable
        return false;
    }
    // by error code
    return err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT';
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const BASE_URL = import.meta.env.VITE_API_URL;

/** Normalize any error into a single shape. */
function toHttpError(e: unknown): HttpError {
    if (typeof e === 'object' && e !== null && 'code' in (e as any) && 'message' in (e as any)) {
        return e as HttpError;
    }
    return { code: 'NETWORK_ERROR', message: (e as Error)?.message || 'Network error' };
}

/** Fetch wrapper with base URL, JSON, cancellation, and timeout support. */
export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const {
        method = 'GET',
        headers = {},
        body,
        timeout = 10_000,
        signal,
        withAuth = true,
        retry = {},
    } = options;

    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    // final retry settings
    const r = { ...DEFAULT_RETRY, ...retry };
    const isRetryAllowedForMethod = r.retryOnMethods.includes(method);

    // build headers, including auth when enabled
    const baseHeaders: Record<string, string> = { ...headers };
    if (withAuth) {
        const token = getAuthToken();
        if (token && !baseHeaders['Authorization']) {
            baseHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    // prepare the request body
    let fetchBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
        if (!baseHeaders['Content-Type']) baseHeaders['Content-Type'] = 'application/json';
        fetchBody = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // One request attempt without retries.
    const attemptOnce = async (): Promise<T> => {
        const ctrl = new AbortController();
        const timer = setTimeout(
            () => ctrl.abort(new DOMException('Timeout', 'AbortError')),
            timeout,
        );

        if (signal) {
            const onAbort = () => ctrl.abort(signal.reason as any);
            if (signal.aborted) onAbort();
            else signal.addEventListener('abort', onAbort, { once: true });
        }

        try {
            const res = await fetch(fullUrl, {
                method,
                headers: baseHeaders,
                body: fetchBody,
                signal: ctrl.signal,
            });

            clearTimeout(timer);

            if (!res.ok) {
                const text = await safeReadText(res);
                const err: HttpError = {
                    code: res.status,
                    message: text || res.statusText || 'HTTP error',
                };
                // Throw and let the retry loop decide what to do.
                throw err;
            }

            const data = await safeReadJson<T>(res);
            return data as T;
        } catch (e: any) {
            clearTimeout(timer);
            if (e?.name === 'AbortError') {
                if (e?.message === 'Timeout') {
                    throw <HttpError>{ code: 'TIMEOUT', message: 'Request timed out' };
                }
                throw <HttpError>{ code: 'NETWORK_ERROR', message: 'Request aborted' };
            }
            throw toHttpError(e);
        }
    };

    // Retry loop
    let attempt = 0;
    let lastError: HttpError | null = null;

    while (true) {
        try {
            return await attemptOnce();
        } catch (err: any) {
            lastError = toHttpError(err);

            // determine whether another attempt is allowed
            const status = typeof err?.code === 'number' ? (err.code as number) : undefined;
            const canRetry =
                isRetryAllowedForMethod && attempt < r.retries && shouldRetry(lastError, status);

            if (!canRetry) throw lastError;

            // exponential backoff with jitter
            const backoff = Math.floor(
                r.retryDelay * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4),
            );
            attempt += 1;
            await delay(backoff);
            // next attempt
        }
    }
}

/** Response body readers. */
async function safeReadJson<T>(res: Response): Promise<T | undefined> {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        // 204/205 may have an empty body, so return undefined.
        const text = await safeReadText(res);
        return (text ? (JSON.parse(text) as T) : undefined) as T | undefined;
    }
    return (await res.json()) as T;
}

async function safeReadText(res: Response): Promise<string> {
    try {
        return await res.text();
    } catch {
        return '';
    }
}

http.get = async function <T>(url: string, opts: Omit<HttpOptions, 'method' | 'body'> = {}) {
    return http<T>(url, { ...opts, method: 'GET' });
};

http.post = async function <T>(
    url: string,
    body?: unknown,
    opts: Omit<HttpOptions, 'method'> = {},
) {
    return http<T>(url, { ...opts, method: 'POST', body });
};

http.put = async function <T>(url: string, body?: unknown, opts: Omit<HttpOptions, 'method'> = {}) {
    return http<T>(url, { ...opts, method: 'PUT', body });
};

http.patch = async function <T>(
    url: string,
    body?: unknown,
    opts: Omit<HttpOptions, 'method'> = {},
) {
    return http<T>(url, { ...opts, method: 'PATCH', body });
};

http.delete = async function <T>(url: string, opts: Omit<HttpOptions, 'method' | 'body'> = {}) {
    return http<T>(url, { ...opts, method: 'DELETE' });
};
