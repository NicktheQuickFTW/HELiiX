'use client';

import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LetterFxProps {
  children: string;
  speed?: 'slow' | 'medium' | 'fast';
  trigger?: 'instant' | 'hover' | 'inview';
  charset?: string;
  duration?: number;
  className?: string;
}

export function LetterFx({
  children,
  speed = 'medium',
  trigger = 'instant',
  charset = 'X$@aHz0y#?*01+',
  duration = 2000,
  className
}: LetterFxProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const speedMap = {
    slow: 100,
    medium: 50,
    fast: 25
  };

  const animationSpeed = speedMap[speed];

  const scrambleText = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const originalText = children;
    const totalSteps = Math.ceil(duration / animationSpeed);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      
      let newText = '';
      
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ') {
          newText += ' ';
          continue;
        }
        
        const charProgress = Math.max(0, Math.min(1, (progress - (i / originalText.length)) * 2));
        
        if (charProgress >= 1) {
          newText += originalText[i];
        } else if (charProgress > 0) {
          // Gradually reduce scrambling as we get closer to the final character
          if (Math.random() < charProgress) {
            newText += originalText[i];
          } else {
            newText += charset[Math.floor(Math.random() * charset.length)];
          }
        } else {
          newText += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      
      setDisplayText(newText);
      
      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayText(originalText);
        setIsAnimating(false);
      }
    }, animationSpeed);
  };

  // Handle different trigger types
  useEffect(() => {
    if (trigger === 'instant') {
      scrambleText();
    }
  }, [trigger]);

  useEffect(() => {
    if (trigger === 'hover' && isHovered) {
      scrambleText();
    }
  }, [isHovered, trigger]);

  useEffect(() => {
    if (trigger === 'inview' && isInView) {
      scrambleText();
    }
  }, [isInView, trigger]);

  // Intersection Observer for 'inview' trigger
  useEffect(() => {
    if (trigger !== 'inview') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`letter-fx-${Math.random()}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [trigger]);

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
    <span
      className={cn(
        "font-mono transition-all duration-200",
        isAnimating && "text-glow",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: isAnimating ? '0.05em' : '0',
      }}
    >
      {displayText}
      
      <style jsx>{`
        .text-glow {
          text-shadow: 
            0 0 5px rgba(0, 255, 255, 0.8),
            0 0 10px rgba(0, 255, 255, 0.6),
            0 0 15px rgba(0, 255, 255, 0.4),
            0 0 20px rgba(0, 255, 255, 0.2);
          animation: glow-pulse 0.5s ease-in-out infinite alternate;
        }

        @keyframes glow-pulse {
          from {
            text-shadow: 
              0 0 5px rgba(0, 255, 255, 0.8),
              0 0 10px rgba(0, 255, 255, 0.6),
              0 0 15px rgba(0, 255, 255, 0.4),
              0 0 20px rgba(0, 255, 255, 0.2);
          }
          to {
            text-shadow: 
              0 0 2px rgba(0, 255, 255, 0.9),
              0 0 5px rgba(0, 255, 255, 0.7),
              0 0 8px rgba(0, 255, 255, 0.5),
              0 0 12px rgba(0, 255, 255, 0.3);
          }
        }
      `}</style>
    </span>
  );
}

// Big 12 themed variant
export function Big12LetterFx({ children, ...props }: Omit<LetterFxProps, 'charset'>) {
  return (
    <LetterFx
      {...props}
      charset="BIG12★▲■●◆12345"
      className={cn("text-blue-600 dark:text-blue-400", props.className)}
    >
      {children}
    </LetterFx>
  );
}

// Championship themed variant
export function ChampionshipLetterFx({ children, ...props }: Omit<LetterFxProps, 'charset'>) {
  return (
    <LetterFx
      {...props}
      charset="🏆⚡️✨🎯🔥CHAMPION"
      className={cn("text-yellow-600 dark:text-yellow-400", props.className)}
    >
      {children}
    </LetterFx>
  );
}