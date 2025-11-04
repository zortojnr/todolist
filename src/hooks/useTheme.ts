import { useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '../theme';
import { Theme } from '../types';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'todo-theme-preference';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialMode = savedMode || (prefersDark ? 'dark' : 'light');
    setMode(initialMode);
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
      return newMode;
    });
  };

  const theme: Theme = mode === 'dark' ? darkTheme : lightTheme;

  return { mode, theme, toggleTheme, isLoading };
};
