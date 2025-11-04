import React from 'react';
import { Theme } from '../types';
import { Button } from '../components/ui/button';

interface EmptyStateProps {
  theme: Theme;
  isDark: boolean;
  onAddTodo: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ theme, isDark, onAddTodo }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div
        className="w-24 h-24 rounded-full mb-6 flex items-center justify-center transition-colors duration-500"
        style={{
          backgroundColor: isDark ? 'rgba(85, 221, 255, 0.1)' : 'rgba(57, 124, 252, 0.1)',
        }}
      >
        <svg
          className="w-12 h-12"
          style={{ color: theme.colors.accentPrimary }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6"
          />
        </svg>
      </div>

      <h2
        className="text-xl font-bold mb-2 transition-colors duration-300"
        style={{
          fontFamily: theme.fonts.family,
          color: theme.colors.text,
        }}
      >
        No todos yet
      </h2>

      <p
        className="text-center mb-6 transition-colors duration-300"
        style={{
          fontFamily: theme.fonts.family,
          color: theme.colors.textMuted,
          fontSize: theme.fonts.sizeSmall,
        }}
      >
        Get started by creating your first todo. You can manage your tasks and stay organized!
      </p>

      <Button
        onClick={onAddTodo}
        className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
        style={{
          backgroundColor: theme.colors.accentPrimary,
          color: 'white',
          fontFamily: theme.fonts.family,
        }}
      >
        Add your first todo
      </Button>
    </div>
  );
};
