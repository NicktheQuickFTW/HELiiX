"use client";

import React, { useRef, useEffect } from 'react';

interface BorderBeamProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  duration?: number;
  blur?: number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BorderBeam = ({
  children,
  color = 'var(--brand-background-strong)',
  size = 2,
  duration = 5000,
  blur = 10,
  borderRadius = '16px',
  className = '',
  style = {},
}: BorderBeamProps) => {
  const beamRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = beamRef.current;
    if (!element) return;
    
    // Get box dimensions
    const { width, height } = element.getBoundingClientRect();
    
    // Calculate perimeter and timing for the animation
    const perimeter = 2 * (width + height);
    
    // Set up keyframes animation
    element.style.setProperty('--beam-color', color);
    element.style.setProperty('--beam-size', `${size}px`);
    element.style.setProperty('--beam-blur', `${blur}px`);
    element.style.setProperty('--beam-duration', `${duration}ms`);
    element.style.setProperty('--beam-width', `${width}px`);
    element.style.setProperty('--beam-height', `${height}px`);
    
    // Start the animation
    element.classList.add('border-beam-active');
  }, [color, size, duration, blur]);

  return (
    <div
      ref={beamRef}
      className={`border-beam-container ${className}`}
      style={{
        position: 'relative',
        borderRadius,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* The beam effect overlay */}
      <div 
        className="border-beam-effect" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          borderRadius,
          pointerEvents: 'none',
        }}
      />
      
      {/* Children content */}
      <div 
        className="border-beam-content" 
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </div>
      
      <style jsx>{`
        .border-beam-active .border-beam-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          z-index: -1;
          background: conic-gradient(
            transparent,
            transparent 30%,
            var(--beam-color) 40%,
            var(--beam-color) 60%,
            transparent 70%,
            transparent 100%
          );
          animation: beam-animation var(--beam-duration) linear infinite;
          border: none;
        }

        .border-beam-active .border-beam-effect::after {
          content: '';
          position: absolute;
          top: var(--beam-size);
          left: var(--beam-size);
          right: var(--beam-size);
          bottom: var(--beam-size);
          background: var(--surface-background);
          border-radius: calc(${borderRadius} - var(--beam-size));
          z-index: -1;
        }

        @keyframes beam-animation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
