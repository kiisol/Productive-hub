import type { LoginInput, LoginResult } from './model';
import { http } from '@shared/api/http';

export async function login(input: LoginInput): Promise<LoginResult> {
    return http.post<LoginResult>('/auth/login', input, { withAuth: false });
}

export async function logout(): Promise<void> {
    await http.post<void>('/auth/logout');
}
