import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="flex-1">
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 text-sm
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            border border-gray-200 dark:border-gray-700
            rounded-xl
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
            dark:focus:ring-primary-500
            ${error ? 'border-red-400 focus:ring-red-400' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
