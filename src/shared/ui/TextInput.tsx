import React from 'react';
import clsx from 'clsx';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

export const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id || React.useId();
    const errId = `${inputId}-err`;
    const hintId = `${inputId}-hint`;
    const describedBy = [error ? errId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

    return (
      <div className="grid gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={clsx(
            'px-3 py-2 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
            'border-gray-300 dark:border-gray-700 outline-none',
            'focus:ring-2 ring-blue-500',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <small id={hintId} className="text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </small>
        )}
        {error && (
          <small id={errId} role="alert" className="text-xs text-red-600">
            {error}
          </small>
        )}
      </div>
    );
  },
);
TextInput.displayName = 'TextInput';
