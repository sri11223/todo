import type { FilterType } from '@/types';

// ─── Storage Keys ────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  TODOS: 'todo-app:todos',
  THEME: 'todo-app:theme',
} as const;

// ─── Filter Options ──────────────────────────────────────────────────────────

export const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

// ─── UI Constants ────────────────────────────────────────────────────────────

export const MAX_TODO_LENGTH = 200;
export const MIN_TODO_LENGTH = 1;
