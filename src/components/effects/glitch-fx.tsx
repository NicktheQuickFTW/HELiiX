"use client";

import React, { ReactNode } from 'react';

interface GlitchFxProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'medium' | 'fast';
}

export const GlitchFx = ({ 
  children, 
  intensity = 'medium',
  speed = 'medium' 
}: GlitchFxProps) => {
  // Base class
  const baseClass = 'relative inline-block';
  
  // Intensity classes
  const intensityClasses = {
    low: 'glitch-effect-low',
    medium: 'glitch-effect-medium',
    high: 'glitch-effect-high'
  };
  
  // Speed classes
  const speedClasses = {
    slow: 'glitch-speed-slow',
    medium: 'glitch-speed-medium',
    fast: 'glitch-speed-fast'
  };

  return (
    <span 
      className={`${baseClass} ${intensityClasses[intensity]} ${speedClasses[speed]}`}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {children}
      {/* Pseudo glitch elements would be handled by CSS */}
    </span>
  );
};
