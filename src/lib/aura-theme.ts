/**
 * AURA THEME SYSTEM
 * Premium color palette and design tokens for the most beautiful application ever created
 * Inspired by cutting-edge design systems and futuristic aesthetics
 */

export const auraTheme = {
  colors: {
    // === CORE BACKGROUNDS ===
    background: {
      void: '#000000',
      deep: '#0A0A0F',
      dark: '#12121A', 
      surface: '#1A1A25',
      elevated: '#22222F',
      floating: '#2A2A38',
    },
    
    // === PRIMARY PALETTE ===
    primary: {
      50: '#F0F0FF',
      100: '#E0E2FF',
      200: '#C7CAFF',
      300: '#A5A9FF',
      400: '#8B92FF',
      500: '#6366F1', // Main primary
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      950: '#1E1B4B',
    },
    
    // === SECONDARY PALETTE ===
    secondary: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Main secondary
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
    
    // === ETHEREAL GLOW COLORS ===
    glow: {
      purple: '#8B5CF6',
      blue: '#3B82F6',
      cyan: '#06B6D4',
      emerald: '#10B981',
      amber: '#F59E0B',
      rose: '#F43F5E',
      violet: '#7C3AED',
      indigo: '#6366F1',
      pink: '#EC4899',
      orange: '#F97316',
    },
    
    // === GLASSMORPHISM OVERLAYS ===
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.10)',
      strong: 'rgba(255, 255, 255, 0.15)',
      ultra: 'rgba(255, 255, 255, 0.20)',
      // Dark variants for light backgrounds
      darkLight: 'rgba(0, 0, 0, 0.05)',
      darkMedium: 'rgba(0, 0, 0, 0.10)',
      darkStrong: 'rgba(0, 0, 0, 0.15)',
    },
    
    // === TEXT COLORS ===
    text: {
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      muted: '#94A3B8',
      subtle: '#64748B',
      inverse: '#0F172A',
    },
    
    // === BORDER COLORS ===
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.12)',
      strong: 'rgba(255, 255, 255, 0.20)',
      glow: 'rgba(99, 102, 241, 0.5)',
    },
    
    // === STATUS COLORS ===
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  // === GRADIENTS ===
  gradients: {
    primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    secondary: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    rainbow: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 25%, #06B6D4 50%, #10B981 75%, #F59E0B 100%)',
    mesh: `
      radial-gradient(at 20% 10%, rgba(99, 102, 241, 0.08) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.06) 0px, transparent 50%),
      radial-gradient(at 40% 30%, rgba(59, 130, 246, 0.04) 0px, transparent 50%),
      radial-gradient(at 90% 60%, rgba(245, 158, 11, 0.05) 0px, transparent 50%),
      radial-gradient(at 10% 80%, rgba(16, 185, 129, 0.03) 0px, transparent 50%)
    `,
    radial: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.10) 35%, transparent 70%)',
    aurora: 'linear-gradient(45deg, #6366F1, #8B5CF6, #06B6D4, #10B981)',
  },
  
  // === SHADOWS & GLOWS ===
  shadows: {
    glow: `
      0 0 30px rgba(99, 102, 241, 0.3),
      0 0 60px rgba(139, 92, 246, 0.2),
      0 0 90px rgba(59, 130, 246, 0.1)
    `,
    subtle: `
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 40px rgba(99, 102, 241, 0.05)
    `,
    medium: `
      0 8px 40px rgba(0, 0, 0, 0.4),
      0 0 60px rgba(139, 92, 246, 0.08)
    `,
    strong: `
      0 16px 60px rgba(0, 0, 0, 0.5),
      0 0 80px rgba(99, 102, 241, 0.12)
    `,
    floating: `
      0 20px 80px rgba(0, 0, 0, 0.6),
      0 0 100px rgba(99, 102, 241, 0.15)
    `,
  },
  
  // === BLUR VALUES ===
  blur: {
    subtle: 'blur(8px)',
    medium: 'blur(16px)',
    strong: 'blur(24px)',
    ultra: 'blur(40px)',
    extreme: 'blur(60px)',
  },
  
  // === ANIMATION DURATIONS ===
  duration: {
    instant: '150ms',
    fast: '250ms',
    normal: '350ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },
  
  // === EASING CURVES ===
  easing: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  },
  
  // === SPACING SCALE ===
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
    '5xl': '8rem', // 128px
  },
  
  // === BORDER RADIUS ===
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // === TYPOGRAPHY ===
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
      '8xl': '6rem',    // 96px
      '9xl': '8rem',    // 128px
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  
  // === BREAKPOINTS ===
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // === Z-INDEX SCALE ===
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  // === COMPONENT VARIANTS ===
  variants: {
    glassmorphism: {
      subtle: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
      medium: {
        background: 'rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      },
      strong: {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.20)',
      },
    },
    button: {
      primary: {
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        color: '#FFFFFF',
        border: 'none',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.10)',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.20)',
        backdropFilter: 'blur(16px)',
      },
      ghost: {
        background: 'transparent',
        color: '#E2E8F0',
        border: 'none',
      },
    },
  },
};

// === THEME UTILITIES ===
export const createAuraGradient = (colors: string[]) => {
  return `linear-gradient(135deg, ${colors.join(', ')})`;
};

export const createAuraGlow = (color: string, intensity: number = 0.3) => {
  return `0 0 30px ${color.replace(')', `, ${intensity})`)}`;
};

export const createAuraGlass = (opacity: number = 0.1, blur: number = 16) => {
  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${opacity + 0.02})`,
  };
};

export default auraTheme;