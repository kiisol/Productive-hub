import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import type {LoginInput} from './model';
import {useAuth} from './useAuth';
import {useNavigate} from 'react-router-dom';

const schema = z.object({
    email: z.string().email('Введите корректный e-mail'),
    password: z.string().min(6, 'Минимум 6 символов'),
});

export default function LoginForm() {
    const {login, isLoading} = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {register, handleSubmit, formState: {errors, isSubmitting}} =
        useForm<LoginInput>({resolver: zodResolver(schema)});

    const onSubmit = handleSubmit(async (data) => {
        setServerError(null);
        try {
            await login(data);        // пароль для демо: "password123"
            navigate('/dashboard', {replace: true});
        } catch (e: any) {
            setServerError(e?.message || 'Login failed');
        }
    });

    return (
        <form onSubmit={onSubmit} style={{display: 'grid', gap: 12, maxWidth: 320}}>
            <label>
                Email
                <input type="email" {...register('email')} />
            </label>
            {errors.email && <small style={{color: 'crimson'}}>{errors.email.message}</small>}

            <label>
                Password
                <input type="password" {...register('password')} />
            </label>
            {errors.password && <small style={{color: 'crimson'}}>{errors.password.message}</small>}

            {serverError && <div style={{color: 'crimson'}}>{serverError}</div>}

            <button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? 'Signing in…' : 'Sign in'}
            </button>

            <small>Для входа используй пароль: <code>password123</code></small>
        </form>
    );
}
