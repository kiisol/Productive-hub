
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
    body?: unknown;           // объект для JSON
    timeout?: number;         // мс, по умолчанию 10000
    signal?: AbortSignal;     // внешняя отмена (например, из React)
    withAuth?: boolean;       // по умолчанию true
    retry?: RetryOptions;     // настройки ретраев
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
    // по коду ошибки
    return err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT';
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));


const BASE_URL = import.meta.env.VITE_API_URL;

/** Нормализуем любую ошибку к единому виду */
function toHttpError(e: unknown): HttpError {
    if (typeof e === 'object' && e !== null && 'code' in (e as any) && 'message' in (e as any)) {
        return e as HttpError;
    }
    return { code: 'NETWORK_ERROR', message: (e as Error)?.message || 'Network error' };
}

/** Обёртка над fetch с baseURL, JSON, отменой и таймаутом */
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

    // финальные настройки ретраев
    const r = { ...DEFAULT_RETRY, ...retry };
    const isRetryAllowedForMethod = r.retryOnMethods.includes(method);

    // соберём хедеры (с учётом withAuth)
    const baseHeaders: Record<string, string> = { ...headers };
    if (withAuth) {
        const token = getAuthToken();
        if (token && !baseHeaders['Authorization']) {
            baseHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    // подготовим тело
    let fetchBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
        if (!baseHeaders['Content-Type']) baseHeaders['Content-Type'] = 'application/json';
        fetchBody = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Функция одной попытки (без ретраев)
    const attemptOnce = async (): Promise<T> => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(new DOMException('Timeout', 'AbortError')), timeout);

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
                const err: HttpError = { code: res.status, message: text || res.statusText || 'HTTP error' };
                // бросаем — выше решим, ретраить или нет
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

    // Цикл с ретраями
    let attempt = 0;
    let lastError: HttpError | null = null;

    while (true) {
        try {
            return await attemptOnce();
        } catch (err: any) {
            lastError = toHttpError(err);

            // можно ли ретраить?
            const status = typeof err?.code === 'number' ? (err.code as number) : undefined;
            const canRetry =
                isRetryAllowedForMethod && attempt < r.retries && shouldRetry(lastError, status);

            if (!canRetry) throw lastError;

            // экспоненциальная задержка с «джиттером»
            const backoff = Math.floor(r.retryDelay * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4));
            attempt += 1;
            await delay(backoff);
            // следующая попытка
        }
    }
}

/** Утилиты чтения тела ответа */
async function safeReadJson<T>(res: Response): Promise<T | undefined> {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        // может быть пустое тело (204/205) — вернём undefined
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

http.post = async function <T>(url: string, body?: unknown, opts: Omit<HttpOptions, 'method'> = {}) {
    return http<T>(url, { ...opts, method: 'POST', body });
};

http.put = async function <T>(url: string, body?: unknown, opts: Omit<HttpOptions, 'method'> = {}) {
    return http<T>(url, { ...opts, method: 'PUT', body });
};

http.patch = async function <T>(url: string, body?: unknown, opts: Omit<HttpOptions, 'method'> = {}) {
    return http<T>(url, { ...opts, method: 'PATCH', body });
};

http.delete = async function <T>(url: string, opts: Omit<HttpOptions, 'method' | 'body'> = {}) {
    return http<T>(url, { ...opts, method: 'DELETE' });
};
