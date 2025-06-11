'use client';

import { Card } from '@once-ui-system/core';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface DivineCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  glowIntensity?: number;
  borderGradient?: string;
}

export const DivineCard = forwardRef<HTMLDivElement, DivineCardProps>(
  ({ children, glowIntensity = 0.5, borderGradient, style, className, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'relative' }}
        className={className}
      >
        <Card
          ref={ref}
          {...props}
          style={{
            background: 'var(--surface-background)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-medium)',
            position: 'relative',
            overflow: 'hidden',
            ...style,
          }}
        >
          {/* Gradient border effect */}
          <div
            style={{
              position: 'absolute',
              inset: -1,
              background: borderGradient || 'linear-gradient(135deg, #F0B90A 0%, #E91E8C 50%, #9B59B6 100%)',
              borderRadius: 'inherit',
              opacity: glowIntensity,
              zIndex: -1,
              filter: 'blur(2px)',
            }}
          />
          
          {/* Inner glow */}
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(240, 185, 10, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          
          {children}
        </Card>
      </motion.div>
    );
  }
);

DivineCard.displayName = 'DivineCard';