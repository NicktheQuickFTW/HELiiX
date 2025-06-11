"use client";

import React, { useRef, useEffect } from 'react';
import { Column } from '@once-ui-system/core';

interface AnimatedBeamProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  color?: string;
  speed?: 'slow' | 'medium' | 'fast';
  thickness?: number;
  variant?: 'solid' | 'gradient';
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedBeam = ({
  children,
  direction = 'horizontal',
  color = 'var(--brand-background-strong)',
  speed = 'medium',
  thickness = 2,
  variant = 'gradient',
  className = '',
  style = {},
}: AnimatedBeamProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Map speed string to actual duration in ms
  const speedMap = {
    slow: 8000,
    medium: 5000,
    fast: 3000
  };
  
  const duration = speedMap[speed];
  
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    // Apply custom properties
    element.style.setProperty('--beam-color', color);
    element.style.setProperty('--beam-thickness', `${thickness}px`);
    element.style.setProperty('--beam-duration', `${duration}ms`);
  }, [color, thickness, duration]);

  // Generate the appropriate gradient based on direction and variant
  const getGradient = () => {
    if (variant === 'solid') {
      return color;
    }
    
    switch (direction) {
      case 'horizontal':
        return `linear-gradient(to right, transparent, ${color}, transparent)`;
      case 'vertical':
        return `linear-gradient(to bottom, transparent, ${color}, transparent)`;
      case 'diagonal':
        return `linear-gradient(135deg, transparent, ${color}, transparent)`;
      default:
        return `linear-gradient(to right, transparent, ${color}, transparent)`;
    }
  };
  
  // Generate the appropriate animation based on direction
  const getAnimation = () => {
    switch (direction) {
      case 'horizontal':
        return `beam-horizontal ${duration}ms infinite ease-in-out`;
      case 'vertical':
        return `beam-vertical ${duration}ms infinite ease-in-out`;
      case 'diagonal':
        return `beam-diagonal ${duration}ms infinite ease-in-out`;
      default:
        return `beam-horizontal ${duration}ms infinite ease-in-out`;
    }
  };
  
  return (
    <Column
      ref={containerRef}
      className={`animated-beam ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* The beam element */}
      <div 
        className="beam"
        style={{
          position: 'absolute',
          background: getGradient(),
          animation: getAnimation(),
          zIndex: 0,
          pointerEvents: 'none',
          ...(direction === 'horizontal' ? {
            height: `${thickness}px`,
            width: '100%',
            left: 0,
          } : direction === 'vertical' ? {
            width: `${thickness}px`,
            height: '100%',
            top: 0,
          } : {
            height: `${thickness}px`,
            width: '150%',
            transform: 'rotate(45deg)',
          })
        }}
      />
      
      {/* Content on top of the beam */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
      
      <style jsx>{`
        @keyframes beam-horizontal {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes beam-vertical {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        
        @keyframes beam-diagonal {
          0% { transform: translateX(-100%) rotate(45deg); }
          50% { transform: translateX(100%) rotate(45deg); }
          100% { transform: translateX(-100%) rotate(45deg); }
        }
      `}</style>
    </Column>
  );
};
