import type { FilterType } from '@/types';
import { FILTER_OPTIONS } from '@/constants';

// ─── Props ───────────────────────────────────────────────────────────────────

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
  totalCount: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

const filterCounts = (
  filter: FilterType,
  active: number,
  completed: number,
  total: number
): number => {
  switch (filter) {
    case 'active': return active;
    case 'completed': return completed;
    default: return total;
  }
};

export function TodoFilters({
  currentFilter,
  onFilterChange,
  activeCount,
  completedCount,
  totalCount,
}: TodoFiltersProps) {
  return (
    <div
      className="flex gap-1.5 p-1 bg-gray-100/60 dark:bg-gray-800/40 rounded-xl"
      role="tablist"
    >
      {FILTER_OPTIONS.map(({ label, value }) => {
        const count = filterCounts(value, activeCount, completedCount, totalCount);
        const isActive = currentFilter === value;

        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(value)}
            className={`
              relative flex-1 flex items-center justify-center gap-1.5
              px-3 py-2 text-xs font-semibold rounded-lg
              transition-all duration-250 ease-out
              ${isActive
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }
            `}
          >
            {label}
            {count > 0 && (
              <span className={`
                inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                text-[10px] font-bold rounded-full
                transition-colors duration-200
                ${isActive
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'bg-gray-200/60 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
