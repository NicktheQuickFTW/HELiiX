// AURA Theme Implementation for Tailwind CSS
// This file provides the color scheme configuration for the AURACHAT design

export const auraTheme = {
  colors: {
    aura: {
      // Background layers
      bg: {
        primary: '#0A0A0B',
        secondary: '#151517',
        tertiary: '#1A1A1D',
      },
      
      // Glass morphism
      glass: {
        DEFAULT: 'rgba(255, 255, 255, 0.03)',
        hover: 'rgba(255, 255, 255, 0.05)',
        active: 'rgba(255, 255, 255, 0.08)',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-hover': 'rgba(255, 255, 255, 0.12)',
      },
      
      // Primary accent - Golden energy
      gold: {
        DEFAULT: '#FFB800',
        bright: '#FFD700',
        dim: '#CC9200',
        50: '#FFF8E6',
        100: '#FFECB3',
        200: '#FFE080',
        300: '#FFD44D',
        400: '#FFC41A',
        500: '#FFB800',
        600: '#CC9200',
        700: '#996E00',
        800: '#664A00',
        900: '#332500',
      },
      
      // Secondary accent - Warm orange
      orange: {
        DEFAULT: '#FF6B00',
        bright: '#FF8533',
        dim: '#CC5500',
        50: '#FFF0E6',
        100: '#FFD6B3',
        200: '#FFBC80',
        300: '#FFA24D',
        400: '#FF881A',
        500: '#FF6B00',
        600: '#CC5500',
        700: '#994000',
        800: '#662B00',
        900: '#331500',
      },
      
      // Cool accents
      purple: {
        DEFAULT: '#8B5CF6',
        bright: '#A78BFA',
        dim: '#6D28D9',
      },
      
      blue: {
        DEFAULT: '#3B82F6',
        bright: '#60A5FA',
        dim: '#2563EB',
      },
      
      // Status colors
      success: {
        DEFAULT: '#00FF88',
        dim: '#00CC6A',
      },
      
      error: {
        DEFAULT: '#FF3366',
        dim: '#CC2952',
      },
      
      warning: {
        DEFAULT: '#FFAA00',
        dim: '#CC8800',
      },
      
      info: {
        DEFAULT: '#00D4FF',
        dim: '#00A8CC',
      },
      
      // Text hierarchy
      text: {
        primary: '#FFFFFF',
        secondary: '#B8B8B8',
        tertiary: '#808080',
        muted: '#606060',
        disabled: '#404040',
      },
      
      // Neutral palette
      neutral: {
        50: 'rgba(255, 255, 255, 0.05)',
        100: 'rgba(255, 255, 255, 0.10)',
        200: 'rgba(255, 255, 255, 0.15)',
        300: 'rgba(255, 255, 255, 0.20)',
        400: 'rgba(255, 255, 255, 0.25)',
        500: 'rgba(255, 255, 255, 0.30)',
      },
      
      // Dark overlays
      dark: {
        50: 'rgba(0, 0, 0, 0.10)',
        100: 'rgba(0, 0, 0, 0.20)',
        200: 'rgba(0, 0, 0, 0.30)',
        300: 'rgba(0, 0, 0, 0.40)',
        400: 'rgba(0, 0, 0, 0.50)',
        500: 'rgba(0, 0, 0, 0.60)',
      },
    },
  },
  
  // Custom box shadows with glow effects
  boxShadow: {
    'aura-glow': '0 0 30px rgba(255, 184, 0, 0.5)',
    'aura-glow-intense': '0 0 40px rgba(255, 184, 0, 0.8)',
    'aura-glow-orange': '0 0 30px rgba(255, 107, 0, 0.5)',
    'aura-glow-success': '0 0 20px rgba(0, 255, 136, 0.6)',
    'aura-glow-error': '0 0 20px rgba(255, 51, 102, 0.6)',
    'aura-glow-warning': '0 0 20px rgba(255, 170, 0, 0.6)',
    'aura-glow-info': '0 0 20px rgba(0, 212, 255, 0.6)',
    'aura-sm': '0 2px 4px rgba(0, 0, 0, 0.3)',
    'aura-md': '0 4px 8px rgba(0, 0, 0, 0.4)',
    'aura-lg': '0 8px 16px rgba(0, 0, 0, 0.5)',
    'aura-xl': '0 16px 32px rgba(0, 0, 0, 0.6)',
    'aura-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  
  // Backdrop filters
  backdropBlur: {
    'aura': '10px',
    'aura-heavy': '20px',
  },
  
  // Background images for gradients
  backgroundImage: {
    'aura-gradient': 'linear-gradient(135deg, #0A0A0B 0%, #151517 50%, #1A1A1D 100%)',
    'aura-gradient-gold': 'linear-gradient(135deg, #FFB800 0%, #FFD700 50%, #FFB800 100%)',
    'aura-gradient-energy': 'linear-gradient(135deg, #FF6B00 0%, #FFB800 25%, #FFD700 50%, #FFB800 75%, #FF6B00 100%)',
    'aura-gradient-cosmic': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 33%, #00D4FF 66%, #00FF88 100%)',
    'aura-gradient-holographic': `linear-gradient(45deg, 
      #FF6B00 0%, 
      #FFB800 10%, 
      #8B5CF6 20%, 
      #3B82F6 30%, 
      #00D4FF 40%, 
      #00FF88 50%, 
      #FFB800 60%, 
      #FF6B00 70%, 
      #8B5CF6 80%, 
      #3B82F6 90%, 
      #00D4FF 100%
    )`,
    'aura-mesh': `
      radial-gradient(at 40% 20%, rgba(255, 184, 0, 0.03) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(255, 107, 0, 0.02) 0px, transparent 50%),
      radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.02) 0px, transparent 50%),
      radial-gradient(at 80% 50%, rgba(59, 130, 246, 0.01) 0px, transparent 50%),
      radial-gradient(at 0% 100%, rgba(255, 184, 0, 0.02) 0px, transparent 50%)
    `,
  },
};

// Tailwind plugin for custom utilities
export const auraPlugin = {
  theme: {
    extend: auraTheme,
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.aura-glass': {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.aura-glow': {
          boxShadow: '0 0 30px rgba(255, 184, 0, 0.5)',
        },
        '.aura-text-gradient': {
          background: 'linear-gradient(135deg, #FFB800 0%, #FFD700 50%, #FFB800 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.aura-holographic': {
          background: 'var(--aura-gradient-holographic)',
          backgroundSize: '200% 200%',
          animation: 'holographic-shift 8s ease infinite',
        },
      });
    },
  ],
};