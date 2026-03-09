import { useCallback, useMemo, useEffect } from 'react';
import type { Todo, FilterType, Priority } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { todoReducer, filterTodos, getActiveCount, getCompletedCount, getDefaultTodos } from '@/utils/todoUtils';
import { STORAGE_KEYS } from '@/constants';

/**
 * Central hook encapsulating all todo business logic.
 * Single Responsibility: manages todo state + exposes intent-based actions.
 * Dependency Inversion: depends on abstractions (types), not concrete UI.
 */
export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEYS.TODOS, []);
  const [filter, setFilter] = useLocalStorage<FilterType>('todo-app:filter', 'all');

  // ─── Seed mock data on first launch ─────────────────────────────────────
  useEffect(() => {
    setTodos((prev) => {
      if (prev.length === 0) return getDefaultTodos();
      // Migrate old todos that lack the priority field
      const needsMigration = prev.some((t) => t.priority === undefined);
      if (needsMigration) {
        return prev.map((t) => (t.priority === undefined ? { ...t, priority: 'none' as Priority } : t));
      }
      return prev;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Dispatch helper (reduces boilerplate) ──────────────────────────────
  const dispatch = useCallback(
    (action: Parameters<typeof todoReducer>[1]) => {
      setTodos((prev) => todoReducer(prev, action));
    },
    [setTodos]
  );

  // ─── Actions ────────────────────────────────────────────────────────────
  const addTodo = useCallback(
    (text: string, dueDate: string | null = null, priority: Priority = 'none') => {
      if (!text.trim()) return;
      dispatch({ type: 'ADD_TODO', payload: { text, dueDate, priority } });
    },
    [dispatch]
  );

  const toggleTodo = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_TODO', payload: { id } }),
    [dispatch]
  );

  const deleteTodo = useCallback(
    (id: string) => dispatch({ type: 'DELETE_TODO', payload: { id } }),
    [dispatch]
  );

  const editTodo = useCallback(
    (id: string, text: string) => {
      if (!text.trim()) return;
      dispatch({ type: 'EDIT_TODO', payload: { id, text } });
    },
    [dispatch]
  );

  const setDueDate = useCallback(
    (id: string, dueDate: string | null) => {
      dispatch({ type: 'SET_DUE_DATE', payload: { id, dueDate } });
    },
    [dispatch]
  );

  const setPriority = useCallback(
    (id: string, priority: Priority) => {
      dispatch({ type: 'SET_PRIORITY', payload: { id, priority } });
    },
    [dispatch]
  );

  const clearCompleted = useCallback(
    () => dispatch({ type: 'CLEAR_COMPLETED' }),
    [dispatch]
  );

  // ─── Derived State (memoized) ───────────────────────────────────────────
  const filteredTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);
  const activeCount = useMemo(() => getActiveCount(todos), [todos]);
  const completedCount = useMemo(() => getCompletedCount(todos), [todos]);
  const totalCount = todos.length;

  return {
    // State
    todos,
    filteredTodos,
    filter,
    activeCount,
    completedCount,
    totalCount,
    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setDueDate,
    setPriority,
    clearCompleted,
    setFilter,
  };
}
