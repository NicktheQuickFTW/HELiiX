'use client';

import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface GlitchFxProps {
  children: ReactNode;
  fillWidth?: boolean;
  speed?: 'slow' | 'medium' | 'fast';
  intensity?: 'subtle' | 'medium' | 'extreme';
  className?: string;
  style?: CSSProperties;
}

export function GlitchFx({ 
  children, 
  fillWidth = false, 
  speed = 'medium',
  intensity = 'medium',
  className,
  style 
}: GlitchFxProps) {
  const speedMap = {
    slow: '4s',
    medium: '2s', 
    fast: '1s'
  };

  const intensityMap = {
    subtle: { clipOffset: '2px', colorOffset: '1px', scale: 1.01 },
    medium: { clipOffset: '4px', colorOffset: '2px', scale: 1.02 },
    extreme: { clipOffset: '8px', colorOffset: '4px', scale: 1.04 }
  };

  const config = intensityMap[intensity];
  const duration = speedMap[speed];

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        fillWidth && "w-full",
        className
      )}
      style={{
        ...style,
        '--glitch-duration': duration,
        '--clip-offset': config.clipOffset,
        '--color-offset': config.colorOffset,
        '--scale': config.scale,
      } as CSSProperties}
    >
      <div className="glitch-container">
        <div className="glitch-original">{children}</div>
        <div className="glitch-copy glitch-copy-1" aria-hidden="true">{children}</div>
        <div className="glitch-copy glitch-copy-2" aria-hidden="true">{children}</div>
      </div>
      
      <style jsx>{`
        .glitch-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .glitch-original {
          position: relative;
          z-index: 1;
        }

        .glitch-copy {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .glitch-copy-1 {
          animation: glitch-1 var(--glitch-duration) infinite linear alternate-reverse;
          color: #ff0000;
          z-index: -1;
        }

        .glitch-copy-2 {
          animation: glitch-2 var(--glitch-duration) infinite linear alternate-reverse;
          color: #00ffff;
          z-index: -2;
        }

        @keyframes glitch-1 {
          0% {
            clip-path: inset(40% 0 61% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          5% {
            clip-path: inset(92% 0 1% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          10% {
            clip-path: inset(43% 0 1% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          15% {
            clip-path: inset(25% 0 58% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          20% {
            clip-path: inset(54% 0 7% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          25% {
            clip-path: inset(58% 0 43% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          30% {
            clip-path: inset(54% 0 18% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          35% {
            clip-path: inset(21% 0 1% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          40% {
            clip-path: inset(79% 0 14% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          45% {
            clip-path: inset(52% 0 26% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          50% {
            clip-path: inset(90% 0 6% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          55% {
            clip-path: inset(70% 0 27% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          60% {
            clip-path: inset(65% 0 11% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          65% {
            clip-path: inset(16% 0 68% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          70% {
            clip-path: inset(71% 0 8% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          75% {
            clip-path: inset(3% 0 84% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          80% {
            clip-path: inset(2% 0 95% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          85% {
            clip-path: inset(78% 0 13% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          90% {
            clip-path: inset(91% 0 5% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          95% {
            clip-path: inset(96% 0 2% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          100% {
            clip-path: inset(76% 0 21% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
        }

        @keyframes glitch-2 {
          0% {
            clip-path: inset(25% 0 58% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          5% {
            clip-path: inset(54% 0 7% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          10% {
            clip-path: inset(58% 0 43% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          15% {
            clip-path: inset(54% 0 18% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          20% {
            clip-path: inset(21% 0 1% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          25% {
            clip-path: inset(79% 0 14% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          30% {
            clip-path: inset(52% 0 26% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          35% {
            clip-path: inset(90% 0 6% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          40% {
            clip-path: inset(70% 0 27% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          45% {
            clip-path: inset(65% 0 11% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          50% {
            clip-path: inset(16% 0 68% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          55% {
            clip-path: inset(71% 0 8% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          60% {
            clip-path: inset(3% 0 84% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          65% {
            clip-path: inset(2% 0 95% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          70% {
            clip-path: inset(78% 0 13% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          75% {
            clip-path: inset(91% 0 5% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          80% {
            clip-path: inset(96% 0 2% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          85% {
            clip-path: inset(76% 0 21% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          90% {
            clip-path: inset(40% 0 61% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
          95% {
            clip-path: inset(92% 0 1% 0);
            transform: translate(calc(-1 * var(--color-offset)), 0) scale(var(--scale));
          }
          100% {
            clip-path: inset(43% 0 1% 0);
            transform: translate(var(--color-offset), 0) scale(var(--scale));
          }
        }
      `}</style>
    </div>
  );
}