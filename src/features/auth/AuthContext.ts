import { createContext } from 'react';
import type { LoginInput, User } from './model';

export type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (input: LoginInput) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
