import { type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, className = '', checked, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`
            w-5 h-5 rounded-md border-2
            transition-all duration-200 ease-in-out
            flex items-center justify-center
            border-gray-300 dark:border-gray-600
            peer-checked:border-primary-500 peer-checked:bg-primary-500
            peer-focus:ring-2 peer-focus:ring-primary-300 peer-focus:ring-offset-2
            dark:peer-focus:ring-offset-gray-900
            group-hover:border-primary-400
            ${className}
          `.trim()}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white animate-fade-in"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{label}</span>
      )}
    </label>
  );
}
