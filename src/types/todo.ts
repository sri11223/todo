// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate: string | null; // ISO date string 'YYYY-MM-DD' or null
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export type FilterType = 'all' | 'active' | 'completed';

// ─── View Types ──────────────────────────────────────────────────────────────

export type ViewMode = 'list' | 'timeline';

// ─── Action Types (Reducer Pattern) ─────────────────────────────────────────

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string; dueDate: string | null } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'SET_DUE_DATE'; payload: { id: string; dueDate: string | null } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_TODOS'; payload: { todos: Todo[] } };

// ─── Theme Types ─────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
