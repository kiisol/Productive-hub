import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import type { LoginInput, RegisterInput } from './model';
import { useAuth } from './useAuth';
import { t } from '@shared/i18n';
type FormInput = { name: string | undefined; email: string; password: string };

export default function LoginForm() {
    const { login, register: registerUser, isLoading } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
    const [error, setError] = useState('');
    const {
        register,
        handleSubmit,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        resolver: zodResolver(
            z.object({
                name:
                    mode === 'signUp'
                        ? z.string().trim().min(1, t('auth.nameRequired'))
                        : z.string().optional(),
                email: z.string().email(t('auth.invalidEmail')),
                password: z.string().min(6, t('auth.shortPassword')),
            }),
        ),
    });

    const switchMode = () => {
        setMode((current) => (current === 'signIn' ? 'signUp' : 'signIn'));
        setError('');
        clearErrors();
    };

    return (
        <form
            className="login-form"
            onSubmit={handleSubmit(async (data) => {
                setError('');
                try {
                    if (mode === 'signUp') {
                        const input: RegisterInput = {
                            name: data.name || '',
                            email: data.email,
                            password: data.password,
                        };
                        await registerUser(input);
                    } else {
                        const input: LoginInput = {
                            email: data.email,
                            password: data.password,
                        };
                        await login(input);
                    }
                    navigate('/tasks', { replace: true });
                } catch {
                    setError(t(mode === 'signIn' ? 'auth.signInError' : 'auth.signUpError'));
                }
            })}
        >
            {mode === 'signUp' && (
                <label>
                    {t('auth.name')}
                    <input
                        type="text"
                        autoComplete="name"
                        placeholder={t('auth.namePlaceholder')}
                        {...register('name')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                </label>
            )}
            {errors.name && (
                <small className="error" id="name-error">
                    {errors.name.message}
                </small>
            )}
            <label>
                {t('auth.email')}
                <input
                    type="email"
                    autoComplete="email"
                    placeholder={t('auth.emailPlaceholder')}
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
                {isLoading
                    ? t(mode === 'signIn' ? 'auth.signingIn' : 'auth.signingUp')
                    : t(mode === 'signIn' ? 'auth.signIn' : 'auth.signUp')}
            </button>
            <div className="auth-switch">
                <span>{t(mode === 'signIn' ? 'auth.needAccount' : 'auth.haveAccount')}</span>{' '}
                <button type="button" onClick={switchMode}>
                    {t(mode === 'signIn' ? 'auth.switchToSignUp' : 'auth.switchToSignIn')}
                </button>
            </div>
        </form>
    );
}
