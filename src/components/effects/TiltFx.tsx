'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TiltFxProps {
  children: ReactNode;
  aspectRatio?: number;
  radius?: 'none' | 's' | 'm' | 'l' | 'xl';
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  glareMaxOpacity?: number;
  className?: string;
}

export function TiltFx({
  children,
  aspectRatio,
  radius = 'm',
  maxTilt = 15,
  perspective = 1000,
  scale = 1.05,
  speed = 300,
  glare = true,
  glareMaxOpacity = 0.7,
  className
}: TiltFxProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const radiusMap = {
    none: 'rounded-none',
    s: 'rounded-sm',
    m: 'rounded-md',
    l: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

    setTilt({ x: -rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "tilt-container relative transition-all duration-200 ease-out",
        radiusMap[radius],
        className
      )}
      style={{
        aspectRatio: aspectRatio?.toString(),
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="tilt-content w-full h-full relative overflow-hidden"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? scale : 1})`,
          transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
        
        {/* Glare effect */}
        {glare && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                ${Math.atan2(tilt.y, tilt.x) * (180 / Math.PI) + 90}deg,
                rgba(255, 255, 255, ${(Math.abs(tilt.x) + Math.abs(tilt.y)) / (maxTilt * 2) * glareMaxOpacity}) 0%,
                transparent 80%
              )`,
              borderRadius: 'inherit',
              transition: `background ${speed}ms ease-out`,
            }}
          />
        )}
        
        {/* Shadow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: isHovered 
              ? `${tilt.y * 0.5}px ${tilt.x * 0.5}px ${Math.abs(tilt.x + tilt.y) * 0.5 + 10}px rgba(0, 0, 0, 0.3)`
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: `box-shadow ${speed}ms ease-out`,
            borderRadius: 'inherit',
          }}
        />
      </div>
    </div>
  );
}

// Big 12 themed tilt variant
export function Big12TiltFx({ children, ...props }: TiltFxProps) {
  return (
    <TiltFx
      {...props}
      className={cn("big12-tilt", props.className)}
      glareMaxOpacity={0.4}
    >
      <div className="relative w-full h-full">
        {children}
        {/* Big 12 branded overlay */}
        <div className="absolute inset-0 pointer-events-none big12-overlay" />
      </div>
      
      <style jsx>{`
        .big12-tilt:hover .big12-overlay {
          background: linear-gradient(
            135deg,
            rgba(0, 100, 200, 0.1) 0%,
            rgba(0, 150, 255, 0.05) 50%,
            rgba(100, 200, 255, 0.1) 100%
          );
          animation: big12-pulse 2s ease-in-out infinite;
        }

        @keyframes big12-pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </TiltFx>
  );
}

// Championship card tilt variant
export function ChampionshipTiltFx({ children, ...props }: TiltFxProps) {
  return (
    <TiltFx
      {...props}
      className={cn("championship-tilt", props.className)}
      glareMaxOpacity={0.8}
      maxTilt={20}
      scale={1.08}
    >
      <div className="relative w-full h-full">
        {children}
        {/* Championship golden overlay */}
        <div className="absolute inset-0 pointer-events-none championship-overlay" />
      </div>
      
      <style jsx>{`
        .championship-tilt {
          position: relative;
        }

        .championship-tilt::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700, #ff8c00);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 300ms ease;
        }

        .championship-tilt:hover::before {
          opacity: 0.6;
          animation: championship-glow 1.5s ease-in-out infinite alternate;
        }

        .championship-tilt:hover .championship-overlay {
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.2) 0%,
            rgba(255, 140, 0, 0.1) 50%,
            transparent 100%
          );
        }

        @keyframes championship-glow {
          0% {
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 140, 0, 0.6);
          }
        }
      `}</style>
    </TiltFx>
  );
}

// Team card tilt variant with school colors
export function TeamTiltFx({ 
  children, 
  school,
  ...props 
}: TiltFxProps & { 
  school?: string 
}) {
  // Basic Big 12 school color mapping
  const schoolColors: Record<string, { primary: string; secondary: string }> = {
    kansas: { primary: '#0051BA', secondary: '#E8000D' },
    texas: { primary: '#BF5700', secondary: '#FFFFFF' },
    oklahoma: { primary: '#841617', secondary: '#FDD023' },
    'kansas-state': { primary: '#512888', secondary: '#FFFFFF' },
    baylor: { primary: '#003015', secondary: '#FFB81C' },
    tcu: { primary: '#4D1979', secondary: '#A3A9AC' },
    'texas-tech': { primary: '#CC0000', secondary: '#000000' },
    'oklahoma-state': { primary: '#FF6600', secondary: '#000000' },
    'west-virginia': { primary: '#002855', secondary: '#EAAA00' },
    'iowa-state': { primary: '#C8102E', secondary: '#F1BE48' },
  };

  const colors = school ? schoolColors[school.toLowerCase()] : { primary: '#0051BA', secondary: '#FFFFFF' };

  return (
    <TiltFx
      {...props}
      className={cn("team-tilt", props.className)}
    >
      <div className="relative w-full h-full">
        {children}
        <div className="absolute inset-0 pointer-events-none team-overlay" />
      </div>
      
      <style jsx>{`
        .team-tilt:hover .team-overlay {
          background: linear-gradient(
            135deg,
            ${colors.primary}20 0%,
            ${colors.secondary}10 50%,
            ${colors.primary}20 100%
          );
        }
      `}</style>
    </TiltFx>
  );
}