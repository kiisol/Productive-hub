import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import type { LoginInput } from './model';
import { useAuth } from './useAuth';
import { t } from '@shared/i18n';
const schema = z.object({
    email: z.string().email(t('auth.invalidEmail')),
    password: z.string().min(6, t('auth.shortPassword')),
});
export default function LoginForm() {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({ resolver: zodResolver(schema) });
    return (
        <form
            className="login-form"
            onSubmit={handleSubmit(async (data) => {
                setError('');
                try {
                    await login(data);
                    navigate('/tasks', { replace: true });
                } catch {
                    setError(t('auth.signInError'));
                }
            })}
        >
            <label>
                Email
                <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                />
            </label>
            {errors.email && (
                <small className="error" id="email-error">
                    {errors.email.message}
                </small>
            )}
            <label>
                {t('auth.password')}
                <input
                    type="password"
                    autoComplete="current-password"
                    placeholder={t('auth.passwordPlaceholder')}
                    {...register('password')}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                />
            </label>
            {errors.password && (
                <small className="error" id="password-error">
                    {errors.password.message}
                </small>
            )}
            {error && (
                <p role="alert" className="error">
                    {error}
                </p>
            )}
            <button className="primary" disabled={isLoading || isSubmitting}>
                {isLoading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
            <div className="demo-note">
                {t('auth.demoSpace')}
                <br />
                <span>
                    {t('auth.demoHint')} <code>password123</code>
                </span>
            </div>
        </form>
    );
}
