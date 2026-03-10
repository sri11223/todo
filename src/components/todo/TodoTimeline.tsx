import { useMemo } from 'react';
import type { Todo } from '@/types';
import { getRelativeDateLabel } from '@/components/ui/DatePicker';

// ─── Props ───────────────────────────────────────────────────────────────────

interface TodoTimelineProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadSampleData?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface DateGroup {
  dateKey: string;
  label: string;
  color: string;
  sortKey: string;
  todos: Todo[];
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDateCategory(dateStr: string | null): 'overdue' | 'today' | 'upcoming' | 'later' | 'nodate' {
  if (!dateStr) return 'nodate';
  const today = todayStr();
  if (dateStr < today) return 'overdue';
  if (dateStr === today) return 'today';
  const d = new Date(dateStr + 'T00:00:00');
  const t = new Date(today + 'T00:00:00');
  const diff = (d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);
  if (diff <= 7) return 'upcoming';
  return 'later';
}

const categoryConfig = {
  overdue: { emoji: '🔴', accent: 'from-red-500 to-rose-500', dot: 'bg-red-500', badge: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' },
  today: { emoji: '🔵', accent: 'from-primary-500 to-blue-500', dot: 'bg-primary-500', badge: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' },
  upcoming: { emoji: '🟡', accent: 'from-amber-500 to-yellow-500', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
  later: { emoji: '🟢', accent: 'from-emerald-500 to-green-500', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
  nodate: { emoji: '⚪', accent: 'from-gray-400 to-gray-500', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
};

const categoryOrder = { overdue: 0, today: 1, upcoming: 2, later: 3, nodate: 4 };

// ─── Component ───────────────────────────────────────────────────────────────

export function TodoTimeline({ todos, onToggle, onDelete, onLoadSampleData }: TodoTimelineProps) {
  const groups = useMemo(() => {
    const map = new Map<string, DateGroup>();

    for (const todo of todos) {
      const cat = getDateCategory(todo.dueDate);
      const key = todo.dueDate || '__nodate__';
      const existing = map.get(key);

      if (existing) {
        existing.todos.push(todo);
      } else {
        const info = getRelativeDateLabel(todo.dueDate);
        const dateLabel = todo.dueDate
          ? new Date(todo.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })
          : 'No due date';

        map.set(key, {
          dateKey: key,
          label: dateLabel,
          color: info.color,
          sortKey: `${categoryOrder[cat]}-${todo.dueDate || 'zzz'}`,
          todos: [todo],
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [todos]);

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 flex items-center justify-center rotate-3 border border-gray-200/50 dark:border-gray-700/50">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">No tasks to show</p>
        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1.5">Add tasks with due dates to see your timeline</p>

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
    <div className="relative space-y-0 pl-6" role="list" aria-label="Task timeline">
      {/* Vertical timeline line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-300 via-accent-300 to-emerald-300 dark:from-primary-600 dark:via-accent-600 dark:to-emerald-600 rounded-full opacity-40" />

      {groups.map((group, groupIdx) => {
        const cat = group.dateKey === '__nodate__' ? 'nodate' : getDateCategory(group.dateKey === '__nodate__' ? null : group.dateKey);
        const config = categoryConfig[cat];
        const completedInGroup = group.todos.filter((t) => t.completed).length;
        const totalInGroup = group.todos.length;

        return (
          <div key={group.dateKey} className="relative animate-fade-in" style={{ animationDelay: `${groupIdx * 80}ms` }}>
            {/* Timeline node */}
            <div className="absolute -left-6 top-3 flex items-center justify-center">
              <div className={`w-3.5 h-3.5 rounded-full ${config.dot} ring-4 ring-white dark:ring-[#0B1120] shadow-sm`} />
            </div>

            {/* Date header */}
            <div className="flex items-center gap-2 mb-2 pt-1">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {group.label}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${config.badge}`}>
                {completedInGroup}/{totalInGroup}
              </span>
              {completedInGroup === totalInGroup && totalInGroup > 0 && (
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            {/* Tasks in this date group */}
            <div className="space-y-1.5 mb-6">
              {group.todos.map((todo) => (
                <TimelineItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  accent={config.accent}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Timeline Item ───────────────────────────────────────────────────────────

function TimelineItem({
  todo,
  onToggle,
  onDelete,
  accent,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  accent: string;
}) {
  return (
    <div
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-xl
        transition-all duration-200
        ${todo.completed
          ? 'bg-gray-50/40 dark:bg-gray-800/20'
          : 'bg-white/50 dark:bg-gray-800/30 hover:bg-white/80 dark:hover:bg-gray-800/50'
        }
        border border-gray-100/60 dark:border-gray-700/30
        hover:border-gray-200/80 dark:hover:border-gray-600/50
        hover:shadow-sm
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`
          flex-shrink-0 w-4.5 h-4.5 w-[18px] h-[18px] rounded-md
          border-2 transition-all duration-300
          flex items-center justify-center
          ${todo.completed
            ? `bg-gradient-to-br ${accent} border-transparent shadow-sm`
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }
        `}
      >
        {todo.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span className={`
        flex-1 text-sm font-medium transition-all duration-200
        ${todo.completed
          ? 'line-through text-gray-400 dark:text-gray-500'
          : 'text-gray-700 dark:text-gray-200'
        }
      `}>
        {todo.text}
      </span>

      {/* Priority Badge */}
      {todo.priority && todo.priority !== 'none' && (
        <span className={`
          px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
          ${todo.priority === 'high' ? 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400' : ''}
          ${todo.priority === 'medium' ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400' : ''}
          ${todo.priority === 'low' ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400' : ''}
        `}>
          {todo.priority}
        </span>
      )}

      {/* Created time */}
      <span className="text-[10px] text-gray-300 dark:text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
        {new Date(todo.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1 rounded-md text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
        aria-label={`Delete "${todo.text}"`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
