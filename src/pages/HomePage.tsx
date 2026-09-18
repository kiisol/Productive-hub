// import { http } from '@shared/api/http';
import { Button } from '@shared/ui/Button';
// import { useEffect } from 'react';
// type Post = { id: number; title: string };
export default function HomePage() {
    // useEffect(() => {
    //     localStorage.setItem('auth_token', 'demo-token-123'); // simulate login
    //
    //     // 1) Success — Authorization is attached
    //     http.get('/posts?userId=1').then((d) => console.log('OK len:', d?.length));
    //
    //     // 2) Network error — see two retries in DevTools (GET)
    //     http.get('https://no-such-host-xyz.example.com/posts', { retry: { retries: 2, retryDelay: 200 } })
    //         .catch((e) => console.log('NETWORK with retries:', e));
    //
    //     // 3) 429/503 (with a test server) — the request should retry
    //     // http.get('/sometimes-busy', { retry: { retries: 2 } }).catch(console.log);
    //
    //     // 4) POST is not retried by default (safety)
    //     http.post('/posts', { title: 'x' }).catch((e) => console.log('POST err:', e));
    // }, []);

    return (
        <div>
            <h1>Homex</h1>
            <Button>Click me</Button>
        </div>
    );
}
