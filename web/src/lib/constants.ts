export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export const IMAGE_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
  backdrop: 'w1280',
} as const;

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
} as const;
