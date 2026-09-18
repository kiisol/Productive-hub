import type { LoginInput, LoginResult } from './model';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(input: LoginInput): Promise<LoginResult> {
    await delay(600);
    const { email, password } = input;
    if (!email.includes('@') || password !== 'password123') {
        const err = new Error('Invalid credentials');
        (err as any).code = 401;
        throw err;
    }
    return {
        token: 'demo-token-' + Math.random().toString(36).slice(2),
        user: { id: 'u1', email, name: email.split('@')[0] },
    };
}

export async function logout(): Promise<void> {
    await delay(100);
}