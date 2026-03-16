export const colors = {
  bg: {
    page: '#0A0F1C',
    surface: '#1E293B',
    inset: '#0F172A',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    muted: '#64748B',
  },
  border: '#0F172A',
  accent: {
    CHILL: '#F59E0B', // warm amber
    DEV: '#22D3EE', // electric cyan
  },
} as const;

export type Mode = 'CHILL' | 'DEV';
