import type { Todo, FilterType, TodoAction, Priority } from '@/types';

// ─── ID Generation ───────────────────────────────────────────────────────────

export const generateId = (): string => {
  return crypto.randomUUID();
};

// ─── Todo Factory ────────────────────────────────────────────────────────────

export const createTodo = (text: string, dueDate: string | null = null, priority: Priority = 'none'): Todo => ({
  id: generateId(),
  text: text.trim(),
  completed: false,
  createdAt: Date.now(),
  dueDate,
  priority,
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
      return [createTodo(action.payload.text, action.payload.dueDate, action.payload.priority), ...state];

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

    case 'SET_DUE_DATE':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, dueDate: action.payload.dueDate }
          : todo
      );

    case 'SET_PRIORITY':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, priority: action.payload.priority }
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

// ─── Mock Data Generator ─────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

export function getDefaultTodos(): Todo[] {
  return [
    {
      id: generateId(),
      text: 'Review Q1 project proposal and share feedback with team',
      completed: false,
      createdAt: Date.now() - 3600000,
      dueDate: toDateStr(new Date()),
      priority: 'high',
    },
    {
      id: generateId(),
      text: 'Update team documentation on Confluence',
      completed: true,
      createdAt: Date.now() - 86400000,
      dueDate: addDays(-1),
      priority: 'medium',
    },
    {
      id: generateId(),
      text: 'Schedule 1-on-1 meeting with project lead',
      completed: false,
      createdAt: Date.now() - 7200000,
      dueDate: addDays(1),
      priority: 'medium',
    },
    {
      id: generateId(),
      text: 'Fix responsive layout bugs on mobile dashboard',
      completed: false,
      createdAt: Date.now() - 14400000,
      dueDate: addDays(3),
      priority: 'high',
    },
    {
      id: generateId(),
      text: 'Prepare slide deck for Friday standup presentation',
      completed: false,
      createdAt: Date.now() - 28800000,
      dueDate: addDays(5),
      priority: 'low',
    },
    {
      id: generateId(),
      text: 'Research new testing framework options for CI/CD',
      completed: true,
      createdAt: Date.now() - 172800000,
      dueDate: addDays(-2),
      priority: 'low',
    },
    {
      id: generateId(),
      text: 'Deploy staging environment v2.4 and run smoke tests',
      completed: false,
      createdAt: Date.now() - 43200000,
      dueDate: null,
      priority: 'none',
    },
    {
      id: generateId(),
      text: 'Write unit tests for authentication module',
      completed: false,
      createdAt: Date.now() - 57600000,
      dueDate: addDays(7),
      priority: 'high',
    },
    {
      id: generateId(),
      text: 'Design new onboarding flow wireframes',
      completed: false,
      createdAt: Date.now() - 10800000,
      dueDate: addDays(2),
      priority: 'medium',
    },
    {
      id: generateId(),
      text: 'Refactor database query optimization layer',
      completed: true,
      createdAt: Date.now() - 259200000,
      dueDate: addDays(-3),
      priority: 'high',
    },
  ];
}
