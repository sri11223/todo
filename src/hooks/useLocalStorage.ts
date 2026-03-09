import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for syncing state with localStorage.
 * Follows the Open/Closed Principle — works with any serializable type.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initializer — only reads from storage on mount
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Persist to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Memoized setter to avoid unnecessary re-renders in consumers
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) =>
        value instanceof Function ? value(prev) : value
      );
    },
    []
  );

  return [storedValue, setValue] as const;
}
