export const colors = {
  primary: '#4A90E2',
  primaryLight: '#60A5FA',
  primaryDark: '#3B82F6',
  ink: '#0F172A',
  inkSoft: '#1A202C',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F5F9',
  border: '#E5E7EB',
  muted: '#9CA3AF',
  danger: '#EF4444',
  black: '#000000',
  white: '#FFFFFF',
  gradientStart: '#60A5FA',
  gradientEnd: '#4A90E2',
  overlay: 'rgba(15,23,42,0.55)',
};

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: 'System',
  h1: {fontSize: 28, fontWeight: '700' as const, lineHeight: 34},
  h2: {fontSize: 22, fontWeight: '700' as const, lineHeight: 28},
  h3: {fontSize: 18, fontWeight: '600' as const, lineHeight: 26},
  body: {fontSize: 15, fontWeight: '400' as const, lineHeight: 22},
  bodyMedium: {fontSize: 15, fontWeight: '500' as const, lineHeight: 22},
  small: {fontSize: 13, fontWeight: '400' as const, lineHeight: 18},
  tiny: {fontSize: 11, fontWeight: '500' as const, lineHeight: 16},
};
