'use client';

import { Button } from '@once-ui-system/core';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface DivineButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  variant?: 'primary' | 'secondary' | 'ghost';
  glowColor?: string;
}

export const DivineButton = forwardRef<HTMLButtonElement, DivineButtonProps>(
  ({ children, variant = 'primary', glowColor, style, ...props }, ref) => {
    const variants = {
      primary: {
        background: 'linear-gradient(135deg, #F0B90A 0%, #E91E8C 50%, #9B59B6 100%)',
        color: 'white',
        border: 'none',
      },
      secondary: {
        background: 'transparent',
        color: 'var(--onBackground-strong)',
        border: '1px solid var(--border-strong)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--onBackground-medium)',
        border: 'none',
      },
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ display: 'inline-block' }}
      >
        <Button
          ref={ref}
          {...props}
          style={{
            ...variants[variant],
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            ...style,
          }}
        >
          {variant === 'primary' && (
            <motion.div
              className="divine-button-glow"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                inset: -2,
                background: glowColor || 'linear-gradient(135deg, #F0B90A 0%, #E91E8C 50%, #9B59B6 100%)',
                filter: 'blur(8px)',
                zIndex: -1,
              }}
            />
          )}
          {children}
        </Button>
      </motion.div>
    );
  }
);

DivineButton.displayName = 'DivineButton';