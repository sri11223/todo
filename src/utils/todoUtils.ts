import type { Todo, FilterType, TodoAction } from '@/types';

// ─── ID Generation ───────────────────────────────────────────────────────────

export const generateId = (): string => {
  return crypto.randomUUID();
};

// ─── Todo Factory ────────────────────────────────────────────────────────────

export const createTodo = (text: string): Todo => ({
  id: generateId(),
  text: text.trim(),
  completed: false,
  createdAt: Date.now(),
});

// ─── Filtering ───────────────────────────────────────────────────────────────

export const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    case 'all':
    default:
      return todos;
  }
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const getActiveCount = (todos: Todo[]): number =>
  todos.filter((todo) => !todo.completed).length;

export const getCompletedCount = (todos: Todo[]): number =>
  todos.filter((todo) => todo.completed).length;

// ─── Reducer (Single Responsibility — pure state logic) ──────────────────────

export const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [createTodo(action.payload.text), ...state];

    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload.id);

    case 'EDIT_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text.trim() }
          : todo
      );

    case 'CLEAR_COMPLETED':
      return state.filter((todo) => !todo.completed);

    case 'SET_TODOS':
      return action.payload.todos;

    default:
      return state;
  }
};

// ─── Text Helpers ────────────────────────────────────────────────────────────

export const pluralize = (count: number, singular: string, plural?: string): string =>
  count === 1 ? singular : (plural ?? `${singular}s`);
