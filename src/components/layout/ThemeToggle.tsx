'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          {theme === 'dark' ? (
            <Moon size={12} strokeWidth={2.5} />
          ) : (
            <Sun size={12} strokeWidth={2.5} />
          )}
        </span>
      </span>
    </button>
  );
}
