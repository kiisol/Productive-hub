import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthState, LoginInput, User } from './model';
import * as api from './service';

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (input: LoginInput) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'auth_token';
const STORAGE_USER = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({ user: null, token: null });
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem(STORAGE_KEY);
            const userStr = localStorage.getItem(STORAGE_USER);
            const user = userStr ? (JSON.parse(userStr) as User) : null;
            if (token) setState({ token, user });
        } catch {}
    }, []);

    const doLogin = useCallback(async (input: LoginInput) => {
        setLoading(true);
        try {
            const { token, user } = await api.login(input);
            setState({ token, user });
            localStorage.setItem(STORAGE_KEY, token);
            localStorage.setItem(STORAGE_USER, JSON.stringify(user));
        } finally {
            setLoading(false);
        }
    }, []);

    const doLogout = useCallback(async () => {
        setLoading(true);
        try {
            await api.logout();
            setState({ token: null, user: null });
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_USER);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo<AuthContextType>(
        () => ({ user: state.user, token: state.token, login: doLogin, logout: doLogout, isLoading }),
        [state.user, state.token, doLogin, doLogout, isLoading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}