import type { Todo, Priority } from '@/types';
import { TodoItem } from './TodoItem';

// ─── Props ───────────────────────────────────────────────────────────────────

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onSetDueDate: (id: string, dueDate: string | null) => void;
  onSetPriority: (id: string, priority: Priority) => void;
  onLoadSampleData?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────────

export function TodoList({ todos, onToggle, onDelete, onEdit, onSetDueDate, onSetPriority, onLoadSampleData }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        {/* Illustration */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 flex items-center justify-center rotate-6 border border-gray-200/50 dark:border-gray-700/50">
            <svg
              className="w-12 h-12 text-gray-300 dark:text-gray-600 -rotate-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
          No tasks yet
        </p>
        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1.5 max-w-[200px]">
          Type something above and hit Enter or click Add Task to get started
        </p>

        {onLoadSampleData && (
          <button
            onClick={onLoadSampleData}
            className="
              mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-primary-500/10 to-accent-500/10
              hover:from-primary-500/20 hover:to-accent-500/20
              border border-primary-200/50 dark:border-primary-500/20
              text-sm font-semibold text-primary-600 dark:text-primary-400
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Load Sample Data
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-2" role="list" aria-label="Todo list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onSetDueDate={onSetDueDate}
          onSetPriority={onSetPriority}
        />
      ))}
    </ul>
  );
}
