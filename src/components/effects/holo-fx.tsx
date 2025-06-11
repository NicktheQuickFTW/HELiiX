"use client";

import React, { ReactNode } from 'react';

interface HoloFxProps {
  children: ReactNode;
  color?: 'brand' | 'accent' | 'custom';
  customColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const HoloFx = ({ 
  children, 
  color = 'brand',
  customColor,
  intensity = 'medium'
}: HoloFxProps) => {
  // Determine the base gradient based on color prop
  let gradientColor;
  
  switch (color) {
    case 'brand':
      gradientColor = 'var(--brand-background-alpha-medium)';
      break;
    case 'accent':
      gradientColor = 'var(--accent-background-alpha-medium)';
      break;
    case 'custom':
      gradientColor = customColor || 'rgba(0, 255, 255, 0.5)';
      break;
    default:
      gradientColor = 'var(--brand-background-alpha-medium)';
  }

  // Intensity settings
  const intensitySettings = {
    low: { opacity: 0.3, blur: '4px' },
    medium: { opacity: 0.6, blur: '8px' },
    high: { opacity: 0.8, blur: '12px' }
  };

  const { opacity, blur } = intensitySettings[intensity];

  return (
    <div className="holo-effect" style={{ position: 'relative', display: 'inline-block' }}>
      {/* Original content */}
      <div className="holo-content" style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
      
      {/* Holographic glow effect */}
      <div 
        className="holo-glow" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradientColor,
          opacity,
          filter: `blur(${blur})`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
