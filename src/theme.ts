import { Theme } from './types';

export const lightTheme: Theme = {
  colors: {
    bg: '#fafafa',
    bgSecondary: '#ffffff',
    text: '#393a4b',
    textSecondary: '#c8cbe7',
    textMuted: '#9495a5',
    border: '#e3e4f1',
    accentPrimary: '#397cfc',
    accentGradientStart: '#55ddff',
    accentGradientEnd: '#c058f3',
    success: '#4caf50',
    error: '#f44336',
  },
  fonts: {
    family: '"Josefin Sans", sans-serif',
    sizeBase: '14px',
    sizeSmall: '12px',
    sizeLarge: '18px',
  },
};

export const darkTheme: Theme = {
  colors: {
    bg: '#171823',
    bgSecondary: '#25273d',
    text: '#c8cbe7',
    textSecondary: '#767992',
    textMuted: '#5b5e7e',
    border: '#393a4b',
    accentPrimary: '#397cfc',
    accentGradientStart: '#55ddff',
    accentGradientEnd: '#c058f3',
    success: '#4caf50',
    error: '#f44336',
  },
  fonts: {
    family: '"Josefin Sans", sans-serif',
    sizeBase: '14px',
    sizeSmall: '12px',
    sizeLarge: '18px',
  },
};
