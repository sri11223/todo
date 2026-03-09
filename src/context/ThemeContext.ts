import { createContext, useContext } from 'react';
import type { ThemeContextValue } from '@/types';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Custom hook to consume theme context safely.
 * Throws if used outside provider — fail-fast principle.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
