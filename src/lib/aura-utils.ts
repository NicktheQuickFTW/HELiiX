/**
 * AURA UTILITIES
 * Premium utility functions for creating the most beautiful application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// === CLASS NAME UTILITIES ===
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// === ANIMATION UTILITIES ===
export const createStaggeredAnimation = (
  element: string,
  delay: number = 0.1,
  duration: number = 0.6
) => {
  return {
    [`${element}:nth-child(1)`]: { animationDelay: `${delay * 0}s` },
    [`${element}:nth-child(2)`]: { animationDelay: `${delay * 1}s` },
    [`${element}:nth-child(3)`]: { animationDelay: `${delay * 2}s` },
    [`${element}:nth-child(4)`]: { animationDelay: `${delay * 3}s` },
    [`${element}:nth-child(5)`]: { animationDelay: `${delay * 4}s` },
    [`${element}:nth-child(6)`]: { animationDelay: `${delay * 5}s` },
  };
};

// === COLOR UTILITIES ===
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createGradient = (colors: string[], direction: string = '135deg'): string => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

export const createRadialGradient = (colors: string[], shape: string = 'ellipse at center'): string => {
  return `radial-gradient(${shape}, ${colors.join(', ')})`;
};

// === GLASSMORPHISM UTILITIES ===
export const createGlassmorphism = (options: {
  opacity?: number;
  blur?: number;
  borderOpacity?: number;
  borderRadius?: string;
}) => {
  const {
    opacity = 0.1,
    blur = 16,
    borderOpacity = 0.12,
    borderRadius = '16px'
  } = options;

  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    borderRadius,
  };
};

// === GLOW UTILITIES ===
export const createGlow = (color: string, intensity: number = 0.3, size: number = 30): string => {
  return `0 0 ${size}px ${hexToRgba(color, intensity)}`;
};

export const createMultiGlow = (glows: Array<{ color: string; intensity: number; size: number }>): string => {
  return glows
    .map(({ color, intensity, size }) => createGlow(color, intensity, size))
    .join(', ');
};

// === PARTICLE UTILITIES ===
export const createParticleConfig = (options: {
  count?: number;
  colors?: string[];
  size?: { min: number; max: number };
  speed?: { min: number; max: number };
  opacity?: { min: number; max: number };
}) => {
  const {
    count = 50,
    colors = ['#6366F1', '#8B5CF6', '#3B82F6'],
    size = { min: 1, max: 3 },
    speed = { min: 0.5, max: 1.5 },
    opacity = { min: 0.3, max: 0.8 }
  } = options;

  return {
    particles: {
      number: {
        value: count,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: colors
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: opacity.max,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: opacity.min,
          sync: false
        }
      },
      size: {
        value: size.max,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: size.min,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: colors[0],
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: speed.max,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      }
    }
  };
};

// === SCROLL UTILITIES ===
export const createSmoothScroll = (target: string | Element, options?: ScrollIntoViewOptions) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      ...options
    });
  }
};

export const getScrollProgress = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return scrollHeight > 0 ? scrollTop / scrollHeight : 0;
};

// === MOUSE UTILITIES ===
export const createMagneticEffect = (element: HTMLElement, strength: number = 0.3) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };
  
  const handleMouseLeave = () => {
    element.style.transform = 'translate(0px, 0px)';
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// === PERFORMANCE UTILITIES ===
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// === DEVICE UTILITIES ===
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const supportsBackdropFilter = (): boolean => {
  return CSS.supports('backdrop-filter', 'blur(1px)') || 
         CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
};

// === RANDOM UTILITIES ===
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const randomColor = (): string => {
  const colors = [
    '#6366F1', '#8B5CF6', '#3B82F6', '#06B6D4',
    '#10B981', '#F59E0B', '#EF4444', '#EC4899'
  ];
  return randomChoice(colors);
};

// === FORMAT UTILITIES ===
export const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', options).format(num);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return formatNumber(amount, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// === VALIDATION UTILITIES ===
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// === LOCAL STORAGE UTILITIES ===
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  getJSON: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  setJSON: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
};

// === INTERSECTION OBSERVER UTILITIES ===
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '0px',
    ...options
  });
};

// === TIME UTILITIES ===
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

export default {
  cn,
  createStaggeredAnimation,
  hexToRgba,
  createGradient,
  createRadialGradient,
  createGlassmorphism,
  createGlow,
  createMultiGlow,
  createParticleConfig,
  createSmoothScroll,
  getScrollProgress,
  createMagneticEffect,
  debounce,
  throttle,
  getDeviceType,
  isTouchDevice,
  supportsBackdropFilter,
  random,
  randomChoice,
  randomColor,
  formatNumber,
  formatCurrency,
  formatPercentage,
  isValidEmail,
  isValidUrl,
  safeLocalStorage,
  createIntersectionObserver,
  sleep,
  formatRelativeTime,
};