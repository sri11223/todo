// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export type FilterType = 'all' | 'active' | 'completed';

// ─── Action Types (Reducer Pattern) ─────────────────────────────────────────

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_TODOS'; payload: { todos: Todo[] } };

// ─── Theme Types ─────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
