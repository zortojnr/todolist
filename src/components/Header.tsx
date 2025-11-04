import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, isDark, onThemeToggle }) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ease-in-out"
      style={{
        backgroundImage: isDark
          ? `linear-gradient(135deg, #171823 0%, #25273d 100%)`
          : `linear-gradient(135deg, #fafafa 0%, #ffffff 100%)`,
        boxShadow: '0px 35px 50px -15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="max-w-md mx-auto px-6 py-8 flex items-center justify-between">
        <h1
          className="font-bold text-4xl tracking-[15px] transition-colors duration-500"
          style={{
            fontFamily: theme.fonts.family,
            color: isDark ? '#ffffff' : '#393a4b',
          }}
        >
          TODO
        </h1>

        <button
          onClick={onThemeToggle}
          aria-label="Toggle theme"
          className="p-2 rounded-lg transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            focusRingColor: theme.colors.accentPrimary,
          }}
        >
          {isDark ? (
            <Sun className="w-6 h-6" style={{ color: '#c8cbe7' }} />
          ) : (
            <Moon className="w-6 h-6" style={{ color: '#393a4b' }} />
          )}
        </button>
      </div>
    </header>
  );
};
