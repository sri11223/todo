import { useState, useRef, useEffect, useCallback, type KeyboardEvent, memo } from 'react';
import type { Todo, Priority } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker';

// ─── Priority Config ─────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string; bg: string }> = {
  none: { label: 'None', color: 'text-gray-400', dot: 'bg-gray-300 dark:bg-gray-600', bg: '' },
  low: { label: 'Low', color: 'text-blue-500', dot: 'bg-blue-400', bg: 'border-l-blue-400' },
  medium: { label: 'Medium', color: 'text-amber-500', dot: 'bg-amber-400', bg: 'border-l-amber-400' },
  high: { label: 'High', color: 'text-red-500', dot: 'bg-red-500', bg: 'border-l-red-500' },
};

const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high'];

// ─── Props ───────────────────────────────────────────────────────────────────

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onSetDueDate: (id: string, dueDate: string | null) => void;
  onSetPriority: (id: string, priority: Priority) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onSetDueDate,
  onSetPriority,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  // Close priority menu on outside click
  useEffect(() => {
    if (!showPriorityMenu) return;
    function handleClick(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setShowPriorityMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPriorityMenu]);

  const handleSaveEdit = useCallback(() => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  }, [editText, todo.id, todo.text, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setEditText(todo.text);
    setIsEditing(false);
  }, [todo.text]);

  const handleEditKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSaveEdit();
      if (e.key === 'Escape') handleCancelEdit();
    },
    [handleSaveEdit, handleCancelEdit]
  );

  const handleDelete = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onDelete(todo.id), 250);
  }, [todo.id, onDelete]);

  const priorityCfg = PRIORITY_CONFIG[todo.priority || 'none'];

  return (
    <li
      className={`
        todo-item-hover group
        flex items-center gap-3 px-4 py-3.5
        rounded-xl border-l-[3px]
        transition-all duration-200 ease-out
        ${isLeaving ? 'animate-slide-out' : 'animate-slide-in'}
        ${todo.priority && todo.priority !== 'none' ? priorityCfg.bg : 'border-l-transparent'}
        ${todo.completed
          ? 'bg-gray-50/60 dark:bg-gray-800/30'
          : 'bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800/60'
        }
        border border-gray-100/80 dark:border-gray-700/40
        hover:border-gray-200 dark:hover:border-gray-600/60
        hover:shadow-sm
      `}
    >
      {/* Custom Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(todo.id); }}
        className={`
          relative flex-shrink-0 w-5 h-5 rounded-lg
          border-2 transition-all duration-300 ease-out
          flex items-center justify-center z-10
          ${todo.completed
            ? 'bg-gradient-to-br from-primary-500 to-accent-500 border-transparent shadow-sm shadow-primary-500/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
        `}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Text / Edit Input */}
      <div className="flex-1 min-w-0 relative z-10">
        {isEditing ? (
          <input
            ref={editInputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleEditKeyDown}
            className="
              w-full px-3 py-1.5 text-sm font-medium
              bg-primary-50/50 dark:bg-primary-500/5
              border border-primary-200 dark:border-primary-500/30
              rounded-lg
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary-400/50
            "
            aria-label="Edit todo text"
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`
              block truncate text-sm font-medium cursor-default select-none
              transition-all duration-300
              ${todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-700 dark:text-gray-200'
              }
            `}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* Priority Badge */}
      {todo.priority && todo.priority !== 'none' && (
        <div className="relative z-10" ref={priorityRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowPriorityMenu(!showPriorityMenu); }}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
              transition-all duration-150 hover:opacity-80
              ${todo.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : ''}
              ${todo.priority === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : ''}
              ${todo.priority === 'low' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : ''}
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot}`} />
            {priorityCfg.label}
          </button>
          {showPriorityMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[100px]">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetPriority(todo.id, p);
                    setShowPriorityMenu(false);
                  }}
                  className={`
                    w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                    ${todo.priority === p ? 'bg-gray-50 dark:bg-gray-800' : ''}
                  `}
                >
                  <span className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[p].dot}`} />
                  <span className={PRIORITY_CONFIG[p].color}>{PRIORITY_CONFIG[p].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Due Date */}
      <div className="flex-shrink-0 relative z-10">
        <DatePicker
          value={todo.dueDate}
          onChange={(date) => onSetDueDate(todo.id, date)}
          placeholder="Due"
        />
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 relative z-10">
        {/* Priority button (when no priority set) */}
        {(!todo.priority || todo.priority === 'none') && (
          <div className="relative" ref={!todo.priority || todo.priority === 'none' ? priorityRef : undefined}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowPriorityMenu(!showPriorityMenu); }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
              aria-label="Set priority"
              title="Set priority"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </button>
            {showPriorityMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[100px]">
                {PRIORITIES.filter(p => p !== 'none').map((p) => (
                  <button
                    key={p}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetPriority(todo.id, p);
                      setShowPriorityMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[p].dot}`} />
                    <span className={PRIORITY_CONFIG[p].color}>{PRIORITY_CONFIG[p].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!isEditing && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
            aria-label={`Edit "${todo.text}"`}
            title="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          aria-label={`Delete "${todo.text}"`}
          title="Delete task"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
});
