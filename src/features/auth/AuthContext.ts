import { createContext } from 'react';
import type { LoginInput, RegisterInput, User } from './model';

export type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
