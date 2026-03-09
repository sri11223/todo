import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { MAX_TODO_LENGTH } from '@/constants';
import { DatePicker } from '@/components/ui/DatePicker';
import type { Priority } from '@/types';

// ─── Priority Config ─────────────────────────────────────────────────────────

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string; dot: string }[] = [
  { value: 'none', label: 'None', color: 'text-gray-400', dot: 'bg-gray-300' },
  { value: 'low', label: 'Low', color: 'text-blue-500', dot: 'bg-blue-400' },
  { value: 'medium', label: 'Med', color: 'text-amber-500', dot: 'bg-amber-400' },
  { value: 'high', label: 'High', color: 'text-red-500', dot: 'bg-red-500' },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface TodoInputProps {
  onAdd: (text: string, dueDate: string | null, priority: Priority) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('none');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const priorityBtnRef = useRef<HTMLDivElement>(null);

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
    onAdd(text, dueDate, priority);
    setText('');
    setDueDate(null);
    setPriority('none');
    setError('');
    inputRef.current?.focus();
  }, [text, dueDate, priority, onAdd]);

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

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority) ?? PRIORITY_OPTIONS[0];

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

        {/* Priority Selector */}
        <div className="relative" ref={priorityBtnRef}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowPriority(!showPriority); }}
            className={`
              inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold
              transition-all duration-150
              ${priority !== 'none'
                ? `${currentPriority.color} bg-gray-50 dark:bg-gray-800/60`
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
              }
            `}
            title="Set priority"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            {priority !== 'none' && <span>{currentPriority.label}</span>}
          </button>
          {showPriority && (
            <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 min-w-[120px] animate-fade-in">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priority</div>
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriority(p.value);
                    setShowPriority(false);
                  }}
                  className={`
                    w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                    ${priority === p.value ? 'bg-gray-50 dark:bg-gray-800' : ''}
                  `}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                  <span className={p.color}>{p.label}</span>
                  {priority === p.value && (
                    <svg className="w-3 h-3 ml-auto text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

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

      {/* Active selections indicator */}
      {(dueDate || priority !== 'none') && (
        <div className="flex items-center gap-2 ml-3 animate-fade-in">
          {priority !== 'none' && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${currentPriority.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentPriority.dot}`} />
              {currentPriority.label} priority
            </span>
          )}
        </div>
      )}

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
