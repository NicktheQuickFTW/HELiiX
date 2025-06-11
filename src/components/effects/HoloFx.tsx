'use client';

import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface HoloFxProps {
  children: ReactNode;
  border?: string;
  maxWidth?: number;
  aspectRatio?: number;
  radius?: 'none' | 's' | 'm' | 'l' | 'xl';
  shine?: {
    opacity?: number;
    blending?: string;
  };
  burn?: {
    opacity?: number;
    blending?: string;
  };
  texture?: {
    opacity?: number;
    image?: string;
    blending?: string;
  };
  className?: string;
  style?: CSSProperties;
}

export function HoloFx({
  children,
  border,
  maxWidth,
  aspectRatio,
  radius = 'm',
  shine = { opacity: 30, blending: 'color-dodge' },
  burn = { opacity: 30, blending: 'color-dodge' },
  texture = { opacity: 10, blending: 'color-dodge' },
  className,
  style
}: HoloFxProps) {
  const radiusMap = {
    none: 'rounded-none',
    s: 'rounded-sm',
    m: 'rounded-md',
    l: 'rounded-lg',
    xl: 'rounded-xl'
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden holo-container",
        radiusMap[radius],
        border && `border border-${border}`,
        className
      )}
      style={{
        maxWidth: maxWidth ? `${maxWidth * 4}px` : undefined,
        aspectRatio: aspectRatio?.toString(),
        ...style,
        '--shine-opacity': `${shine.opacity}%`,
        '--burn-opacity': `${burn.opacity}%`,
        '--texture-opacity': `${texture.opacity}%`,
        '--shine-blend': shine.blending,
        '--burn-blend': burn.blending,
        '--texture-blend': texture.blending,
      } as CSSProperties}
    >
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Holographic shine effect */}
      <div className="holo-shine absolute inset-0 pointer-events-none z-20" />
      
      {/* Burn effect */}
      <div className="holo-burn absolute inset-0 pointer-events-none z-30" />
      
      {/* Texture overlay */}
      {texture.image && (
        <div 
          className="holo-texture absolute inset-0 pointer-events-none z-40"
          style={{
            backgroundImage: `url(${texture.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Rainbow holographic gradient */}
      <div className="holo-rainbow absolute inset-0 pointer-events-none z-50" />

      <style jsx>{`
        .holo-container {
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          backdrop-filter: blur(1px);
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.3),
            0 0 40px rgba(255, 0, 255, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .holo-container:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 0 30px rgba(0, 255, 255, 0.5),
            0 0 60px rgba(255, 0, 255, 0.3),
            0 10px 20px rgba(0, 0, 0, 0.2),
            inset 0 0 30px rgba(255, 255, 255, 0.2);
        }

        .holo-shine {
          background: linear-gradient(
            110deg,
            transparent 25%,
            rgba(255, 255, 255, var(--shine-opacity)) 50%,
            transparent 75%
          );
          mix-blend-mode: var(--shine-blend);
          animation: holo-shine 3s ease-in-out infinite;
        }

        .holo-burn {
          background: radial-gradient(
            circle at center,
            rgba(255, 100, 0, var(--burn-opacity)) 0%,
            rgba(255, 0, 100, var(--burn-opacity)) 30%,
            transparent 70%
          );
          mix-blend-mode: var(--burn-blend);
          animation: holo-burn 4s ease-in-out infinite reverse;
        }

        .holo-texture {
          opacity: var(--texture-opacity);
          mix-blend-mode: var(--texture-blend);
          animation: holo-texture 6s linear infinite;
        }

        .holo-rainbow {
          background: linear-gradient(
            45deg,
            rgba(255, 0, 0, 0.1) 0%,
            rgba(255, 165, 0, 0.1) 16.66%,
            rgba(255, 255, 0, 0.1) 33.33%,
            rgba(0, 255, 0, 0.1) 50%,
            rgba(0, 0, 255, 0.1) 66.66%,
            rgba(75, 0, 130, 0.1) 83.33%,
            rgba(238, 130, 238, 0.1) 100%
          );
          mix-blend-mode: overlay;
          animation: holo-rainbow 8s linear infinite;
        }

        @keyframes holo-shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          50% {
            transform: translateX(0%) skewX(-15deg);
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }

        @keyframes holo-burn {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes holo-texture {
          0% {
            transform: translateX(0) translateY(0) scale(1);
          }
          25% {
            transform: translateX(-2px) translateY(-2px) scale(1.02);
          }
          50% {
            transform: translateX(2px) translateY(2px) scale(0.98);
          }
          75% {
            transform: translateX(-1px) translateY(1px) scale(1.01);
          }
          100% {
            transform: translateX(0) translateY(0) scale(1);
          }
        }

        @keyframes holo-rainbow {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        .holo-container:hover .holo-shine {
          animation-duration: 1.5s;
        }

        .holo-container:hover .holo-burn {
          animation-duration: 2s;
        }

        .holo-container:hover .holo-rainbow {
          animation-duration: 4s;
        }
      `}</style>
    </div>
  );
}