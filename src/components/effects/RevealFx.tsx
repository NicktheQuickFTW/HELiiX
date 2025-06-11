'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealFxProps {
  children: ReactNode;
  delay?: number;
  translateY?: number;
  translateX?: number;
  scale?: number;
  rotate?: number;
  duration?: number;
  trigger?: 'immediate' | 'scroll' | 'hover';
  threshold?: number;
  className?: string;
}

export function RevealFx({
  children,
  delay = 0,
  translateY = 0.3,
  translateX = 0,
  scale = 0.95,
  rotate = 0,
  duration = 0.6,
  trigger = 'scroll',
  threshold = 0.1,
  className
}: RevealFxProps) {
  const [isVisible, setIsVisible] = useState(trigger === 'immediate');
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 'immediate') {
      setIsVisible(true);
      return;
    }

    if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }
  }, [trigger, threshold]);

  useEffect(() => {
    if (trigger === 'hover') {
      setIsVisible(isHovered);
    }
  }, [isHovered, trigger]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsHovered(false);
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn("reveal-fx-container", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--delay': `${delay}s`,
        '--duration': `${duration}s`,
        '--translate-y': `${translateY * 100}%`,
        '--translate-x': `${translateX * 100}%`,
        '--scale': scale,
        '--rotate': `${rotate}deg`,
      } as React.CSSProperties}
    >
      <div className={`reveal-fx-content ${isVisible ? 'reveal-fx-visible' : 'reveal-fx-hidden'}`}>
        {children}
      </div>

      <style jsx>{`
        .reveal-fx-container {
          overflow: hidden;
        }

        .reveal-fx-content {
          transition: all var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transition-delay: var(--delay);
        }

        .reveal-fx-hidden {
          opacity: 0;
          transform: 
            translateY(var(--translate-y)) 
            translateX(var(--translate-x)) 
            scale(var(--scale)) 
            rotate(var(--rotate));
          filter: blur(4px);
        }

        .reveal-fx-visible {
          opacity: 1;
          transform: 
            translateY(0) 
            translateX(0) 
            scale(1) 
            rotate(0deg);
          filter: blur(0px);
        }
      `}</style>
    </div>
  );
}

// Staggered reveal for multiple elements
interface StaggeredRevealProps {
  children: ReactNode[];
  staggerDelay?: number;
  baseDelay?: number;
  className?: string;
}

export function StaggeredReveal({
  children,
  staggerDelay = 0.1,
  baseDelay = 0,
  className
}: StaggeredRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <RevealFx
          key={index}
          delay={baseDelay + (index * staggerDelay)}
          translateY={0.5}
        >
          {child}
        </RevealFx>
      ))}
    </div>
  );
}

// Big 12 themed reveal variants
export function ChampionshipReveal({ children, ...props }: Omit<RevealFxProps, 'scale' | 'duration'>) {
  return (
    <RevealFx
      {...props}
      scale={0.9}
      duration={0.8}
      className={cn("championship-reveal", props.className)}
    >
      <div className="championship-glow">
        {children}
      </div>
      
      <style jsx>{`
        .championship-glow {
          position: relative;
        }

        .championship-reveal .reveal-fx-visible .championship-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          animation: championship-glow 2s ease-out 0.5s forwards;
        }

        @keyframes championship-glow {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
        }
      `}</style>
    </RevealFx>
  );
}

export function SportsReveal({ children, sport, ...props }: RevealFxProps & { sport: 'football' | 'basketball' | 'baseball' | 'general' }) {
  const sportColors = {
    football: { primary: '#8B4513', secondary: '#DEB887' },
    basketball: { primary: '#FF8C00', secondary: '#FFA500' },
    baseball: { primary: '#228B22', secondary: '#90EE90' },
    general: { primary: '#4169E1', secondary: '#87CEEB' }
  };

  const colors = sportColors[sport];

  return (
    <RevealFx
      {...props}
      className={cn("sports-reveal", props.className)}
    >
      <div className="sports-content">
        {children}
      </div>
      
      <style jsx>{`
        .sports-reveal .reveal-fx-visible .sports-content {
          position: relative;
        }

        .sports-reveal .reveal-fx-visible .sports-content::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10);
          border-radius: inherit;
          z-index: -1;
          animation: sports-pulse 3s ease-in-out infinite;
        }

        @keyframes sports-pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.02);
          }
        }
      `}</style>
    </RevealFx>
  );
}