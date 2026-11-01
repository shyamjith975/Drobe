/**
 * DROBE Design Tokens
 * Warm Architectural Studio & Luxury Frosted Glassmorphism Design System
 */

export const colors = {
  // Architectural Warm Studio Palette
  studioBg: '#f3d5bd',
  studioLight: '#fbe9dc',
  studioMedium: '#edd0b7',
  studioDark: '#dfb798',
  studioArch: '#e6be9f',

  // Glassmorphic Surfaces
  glassSurface: 'rgba(255, 250, 244, 0.65)',
  glassSurfaceHover: 'rgba(255, 252, 248, 0.82)',
  glassBorder: 'rgba(255, 255, 255, 0.65)',
  glassInnerGlow: 'rgba(255, 255, 255, 0.85)',
  glassCard: 'rgba(255, 248, 240, 0.72)',
  glassCardDark: 'rgba(25, 25, 25, 0.85)',

  // Brand Primaries & Accents
  charcoal: '#141414',
  charcoalMuted: '#2a2a2a',
  warmIvory: '#F7F5F0',
  white: '#FFFFFF',
  podiumPink: '#e8a5b2',
  podiumCoral: '#e098a5',
  terracotta: '#B85D43',
  champagneGold: '#D4AF37',
  emerald: '#2D5A46',
  stone: '#9c8e82',
  taupe: '#7a6d63'
} as const;

export const typography = {
  fonts: {
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Cormorant Garamond', Georgia, serif"
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
} as const;

export const radii = {
  sm: '8px',
  md: '14px',
  lg: '20px',
  xl: '28px',
  '2xl': '36px',
  full: '9999px'
} as const;

export const shadows = {
  glass: '0 25px 50px -12px rgba(180, 130, 95, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
  card: '0 10px 30px -5px rgba(160, 115, 85, 0.12), 0 1px 0 rgba(255, 255, 255, 0.7) inset',
  pill: '0 4px 14px rgba(160, 115, 85, 0.1)',
  floating: '0 30px 60px rgba(140, 90, 65, 0.25)'
} as const;
