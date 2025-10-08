import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginInput } from './model';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { FormField } from '@shared/ui/FormField';

const schema = z.object({
  email: z.string().email('Введите корректный e-mail'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInput>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      await login(data);
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      setServerError(e?.message || 'Login failed');
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <FormField label="Email" type="email" {...register('email')} errorObj={errors.email} />
      <FormField label="Password" type="password" {...register('password')} errorObj={errors.password} />
      {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
      <Button type="submit" disabled={isSubmitting || isLoading} full>
        {isSubmitting || isLoading ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="text-xs text-gray-500">Демо пароль: <code>password123</code></p>
    </form>
  );
}
