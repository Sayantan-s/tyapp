import React from 'react';
import type { Mode } from './colors.js';

interface ThemeContextValue {
  mode: Mode;
  accent: string;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  mode: 'CHILL',
  accent: '#F59E0B',
});

export const useTheme = () => React.useContext(ThemeContext);
