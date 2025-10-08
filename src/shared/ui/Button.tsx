import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  full?: boolean;
};

export function Button({ variant = 'primary', full, className, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors ' +
    'px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'disabled:opacity-60 disabled:pointer-events-none ' +
    'ring-blue-500 dark:ring-offset-gray-900';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-blue-600 text-white border-transparent hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    ghost:
      'bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
    danger:
      'bg-red-600 text-white border-transparent hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
  };

  return (
    <button
      {...props}
      className={clsx(base, variants[variant], full && 'w-full', className)}
    />
  );
}
