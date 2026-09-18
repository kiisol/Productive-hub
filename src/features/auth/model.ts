export type User = {
    id: string;
    email: string;
    name?: string;
};

export type AuthState = {
    user: User | null;
    token: string | null;
};

export type LoginInput = { email: string; password: string };
export type LoginResult = { token: string; user: User };

