'use client';

import { useEffect } from 'react';

type StyleConfig = {
  theme: string;
  neutral: string;
  brand: string;
  accent: string;
  solid: string;
  solidStyle: string;
  border: string;
  surface: string;
  transition: string;
  scaling: string;
};

export function ThemeInitializer({ style }: { style: StyleConfig }) {
  useEffect(() => {
    try {
      const root = document.documentElement;
      
      // Set default styles from config
      root.setAttribute('data-neutral', style.neutral);
      root.setAttribute('data-brand', style.brand);
      root.setAttribute('data-accent', style.accent);
      root.setAttribute('data-solid', style.solid);
      root.setAttribute('data-solid-style', style.solidStyle);
      root.setAttribute('data-border', style.border);
      root.setAttribute('data-surface', style.surface);
      root.setAttribute('data-transition', style.transition);
      root.setAttribute('data-scaling', style.scaling);
      
      const resolveTheme = (themeValue: string | null) => {
        if (!themeValue || themeValue === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return themeValue;
      };
      
      // Apply theme from localStorage or use default
      const theme = localStorage.getItem('data-theme') || style.theme;
      const resolvedTheme = resolveTheme(theme);
      root.setAttribute('data-theme', resolvedTheme);
      
      // Apply any stored style preferences
      const styleKeys = ['neutral', 'brand', 'accent', 'solid', 'solid-style', 'border', 'surface', 'transition', 'scaling'];
      styleKeys.forEach(key => {
        const value = localStorage.getItem('data-' + key);
        if (value) {
          root.setAttribute('data-' + key, value);
        }
      });
    } catch (e) {
      // Fallback to basic theme settings if errors occur
      document.documentElement.setAttribute('data-theme', style.theme);
      document.documentElement.setAttribute('data-brand', style.brand);
      document.documentElement.setAttribute('data-accent', style.accent);
    }
  }, [style]);

  // This component doesn't render anything visual
  return null;
}
