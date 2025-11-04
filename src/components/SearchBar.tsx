import React from 'react';
import { Search, X } from 'lucide-react';
import { Theme } from '../types';
import { Input } from '../components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  theme: Theme;
  isDark: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, theme, isDark }) => {
  return (
    <div
      className="rounded-lg p-4 shadow-md transition-colors duration-500"
      style={{
        backgroundColor: theme.colors.bgSecondary,
      }}
    >
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5" style={{ color: theme.colors.textMuted }} />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search todos..."
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
          style={{
            fontFamily: theme.fonts.family,
            fontSize: theme.fonts.sizeSmall,
            color: theme.colors.text,
          }}
          aria-label="Search todos"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
          </button>
        )}
      </div>
    </div>
  );
};
