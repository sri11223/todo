import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { MAX_TODO_LENGTH } from '@/constants';
import { DatePicker } from '@/components/ui/DatePicker';

// ─── Props ───────────────────────────────────────────────────────────────────

interface TodoInputProps {
  onAdd: (text: string, dueDate: string | null) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (value: string): string | null => {
    if (!value.trim()) return 'Please enter a task';
    if (value.length > MAX_TODO_LENGTH) return `Maximum ${MAX_TODO_LENGTH} characters`;
    return null;
  };

  const handleSubmit = useCallback(() => {
    const validationError = validate(text);
    if (validationError) {
      setError(validationError);
      return;
    }
    onAdd(text, dueDate);
    setText('');
    setDueDate(null);
    setError('');
    inputRef.current?.focus();
  }, [text, dueDate, onAdd]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        setText('');
        setError('');
      }
    },
    [handleSubmit]
  );

  return (
    <div className="space-y-2">
      <div className={`
        relative flex items-center gap-2 p-1.5 rounded-2xl
        transition-all duration-300
        ${isFocused
          ? 'bg-white dark:bg-gray-800 shadow-lg shadow-primary-500/10 dark:shadow-primary-500/5 ring-2 ring-primary-400/50 dark:ring-primary-500/30'
          : 'bg-gray-100/80 dark:bg-gray-800/50'
        }
        ${error ? 'ring-2 ring-red-400/50' : ''}
      `}>
        {/* Icon */}
        <div className={`
          flex-shrink-0 ml-2 transition-colors duration-200
          ${isFocused ? 'text-primary-500' : 'text-gray-400'}
        `}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done today?"
          className="
            flex-1 px-2 py-3 text-sm font-medium
            bg-transparent
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
          "
          aria-label="New todo text"
          autoFocus
        />

        {/* Character counter */}
        {text.length > 0 && (
          <span className={`
            text-[10px] font-mono mr-1
            ${text.length > MAX_TODO_LENGTH * 0.8 ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}
            ${text.length > MAX_TODO_LENGTH ? 'text-red-500' : ''}
          `}>
            {text.length}/{MAX_TODO_LENGTH}
          </span>
        )}

        {/* Date Picker */}
        <DatePicker value={dueDate} onChange={setDueDate} placeholder="Due date" />

        {/* Add button */}
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="
            flex-shrink-0 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-primary-500 to-accent-500
            text-white text-sm font-semibold
            shadow-lg shadow-primary-500/25 dark:shadow-primary-500/10
            hover:shadow-xl hover:shadow-primary-500/30 hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
            transition-all duration-200
          "
          aria-label="Add todo"
        >
          Add Task
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 ml-3 animate-fade-in flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
