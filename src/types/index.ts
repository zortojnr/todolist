export interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    accentPrimary: string;
    accentGradientStart: string;
    accentGradientEnd: string;
    success: string;
    error: string;
  };
  fonts: {
    family: string;
    sizeBase: string;
    sizeSmall: string;
    sizeLarge: string;
  };
}

export type FilterType = 'all' | 'active' | 'completed' | 'due-soon';
