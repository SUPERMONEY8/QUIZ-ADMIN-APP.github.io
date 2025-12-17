/**
 * Design Tokens for Medical Premium UI
 * Easy theme customization - modify values here to change the entire design system
 */

export const tokens = {
  // Colors - Medical Premium Palette
  colors: {
    white: {
      base: '#FFFFFF',
      soft: 'rgba(255, 255, 255, 0.95)',
      glass: 'rgba(255, 255, 255, 0.06)',
      glassBorder: 'rgba(255, 255, 255, 0.20)',
      glassHover: 'rgba(255, 255, 255, 0.12)',
    },
    teal: {
      primary: '#14b8a6',
      accent: '#2dd4bf',
      glow: 'rgba(20, 184, 166, 0.3)',
      glowStrong: 'rgba(20, 184, 166, 0.5)',
      neon: 'rgba(45, 212, 191, 0.8)',
    },
    gray: {
      light: '#f8fafc',
      medium: '#e2e8f0',
      dark: '#1e293b',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
  },

  // Motion - Physics & Timing
  motion: {
    // Cursor physics (critical-damped spring simulation)
    cursor: {
      damping: 0.15, // Lower = more lag (0.1-0.3 recommended)
      mass: 0.8, // Higher = heavier feel (0.5-1.2 recommended)
      precision: 0.5, // Small pointer size multiplier
      halo: {
        base: 40, // Base halo size in px
        hover: 60, // Hover halo size in px
        pulse: {
          scale: 1.15, // Pulse scale
          duration: 2, // Pulse duration in seconds
        },
      },
    },

    // Magnet effect configuration
    magnet: {
      defaultStrength: 0.22, // Pull strength (0.1-0.4 recommended)
      defaultRadius: 140, // Attraction radius in px (80-200 recommended)
      elementShiftClamp: 12, // Max element movement in px (5-20 recommended)
      spring: {
        stiffness: 300,
        damping: 30,
      },
    },

    // Framer Motion spring presets
    spring: {
      gentle: { stiffness: 100, damping: 20 },
      smooth: { stiffness: 200, damping: 25 },
      snappy: { stiffness: 300, damping: 30 },
      bouncy: { stiffness: 400, damping: 15 },
    },

    // Timing durations (ms)
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
      verySlow: 600,
    },

    // Easing curves
    easing: {
      easeOut: [0.16, 1, 0.3, 1],
      easeInOut: [0.4, 0, 0.2, 1],
      smooth: [0.25, 0.46, 0.45, 0.94],
    },
  },

  // Glassmorphism
  glass: {
    blur: {
      light: '12px',
      medium: '16px',
      heavy: '24px',
    },
    opacity: {
      base: 0.06,
      hover: 0.12,
      border: 0.20,
    },
    shadow: {
      soft: '0 8px 32px rgba(0, 0, 0, 0.08)',
      medium: '0 12px 48px rgba(0, 0, 0, 0.12)',
      glow: '0 0 24px rgba(20, 184, 166, 0.2)',
    },
  },

  // Spacing & Layout
  spacing: {
    radius: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    padding: {
      card: '1.5rem',
      section: '2rem',
    },
  },

  // Motion Personalities (3 distinct styles)
  personalities: {
    'calm-clinical': {
      name: 'Calm Clinical',
      description: 'Minimal motion, precise interactions, medical trust',
      cursor: { damping: 0.2, mass: 1.0, haloSize: 35 },
      magnet: { strength: 0.18, radius: 120 },
      transitions: { duration: 300, spring: 'gentle' },
    },
    'premium-concierge': {
      name: 'Premium Concierge',
      description: 'Smooth, luxurious, reassuring premium feel',
      cursor: { damping: 0.12, mass: 0.9, haloSize: 50 },
      magnet: { strength: 0.25, radius: 160 },
      transitions: { duration: 400, spring: 'smooth' },
    },
    'energetic-assist': {
      name: 'Energetic Assist',
      description: 'Responsive, quick, helpful and engaging',
      cursor: { damping: 0.18, mass: 0.7, haloSize: 45 },
      magnet: { strength: 0.28, radius: 140 },
      transitions: { duration: 250, spring: 'snappy' },
    },
  },
};

// Default personality mapping per page type
export const defaultPersonalityMap = {
  landing: 'premium-concierge',
  dashboard: 'calm-clinical',
  form: 'calm-clinical',
  list: 'energetic-assist',
  modal: 'premium-concierge',
};
