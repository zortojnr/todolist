import React from 'react';
import { Theme, FilterType } from '../types';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

interface FilterRowProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  theme: Theme;
  isDark: boolean;
}

export const FilterRow: React.FC<FilterRowProps> = ({
  activeFilter,
  onFilterChange,
  theme,
  isDark,
}) => {
  return (
    <div
      className="rounded-lg p-4 shadow-md transition-colors duration-500"
      style={{
        backgroundColor: theme.colors.bgSecondary,
      }}
    >
      <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as FilterType)}>
        <TabsList className="w-full bg-transparent h-auto p-0 gap-4 justify-center flex-wrap">
          <TabsTrigger
            value="all"
            className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-300"
            style={{
              color: activeFilter === 'all' ? theme.colors.accentPrimary : theme.colors.textMuted,
              backgroundColor: activeFilter === 'all' ? 'rgba(57, 124, 252, 0.1)' : 'transparent',
            }}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-300"
            style={{
              color: activeFilter === 'active' ? theme.colors.accentPrimary : theme.colors.textMuted,
              backgroundColor: activeFilter === 'active' ? 'rgba(57, 124, 252, 0.1)' : 'transparent',
            }}
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-300"
            style={{
              color:
                activeFilter === 'completed' ? theme.colors.accentPrimary : theme.colors.textMuted,
              backgroundColor:
                activeFilter === 'completed' ? 'rgba(57, 124, 252, 0.1)' : 'transparent',
            }}
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="due-soon"
            className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-300"
            style={{
              color:
                activeFilter === 'due-soon' ? theme.colors.accentPrimary : theme.colors.textMuted,
              backgroundColor:
                activeFilter === 'due-soon' ? 'rgba(57, 124, 252, 0.1)' : 'transparent',
            }}
          >
            Due Soon
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
