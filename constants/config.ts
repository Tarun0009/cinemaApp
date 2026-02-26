// TMDB API Configuration
export const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || 'e33bade4c79ad8b783555152363f9915';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};

// Gemini AI Configuration (Phase 3)
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

export const IMAGE_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
  backdrop: 'w1280',
};

export const COLORS = {
  primary: '#E50914',
  primaryDark: '#B81D24',
  secondary: '#221F1F',
  background: '#141414',
  surface: '#1F1F1F',
  surfaceLight: '#2A2A2A',
  card: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#808080',
  border: '#333333',
  success: '#46d369',
  error: '#E50914',
  warning: '#F5C518',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.8)',
  inputBackground: '#1A1A1A',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  circle: 50,
};