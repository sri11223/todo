import { pluralize } from '@/utils/todoUtils';

// ─── Props ───────────────────────────────────────────────────────────────────

interface TodoStatsProps {
  activeCount: number;
  completedCount: number;
  totalCount: number;
  onClearCompleted: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TodoStats({
  activeCount,
  completedCount,
  totalCount,
  onClearCompleted,
}: TodoStatsProps) {
  if (totalCount === 0) return null;

  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="border-t border-gray-100/80 dark:border-gray-700/40">
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {activeCount} {pluralize(activeCount, 'item')} left
          </span>
          {completedCount > 0 && (
            <span className="text-xs text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {completedCount} done
            </span>
          )}
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="
              text-xs font-medium text-gray-400 dark:text-gray-500
              hover:text-red-500 dark:hover:text-red-400
              transition-colors duration-200
              flex items-center gap-1
            "
            aria-label="Clear completed todos"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
