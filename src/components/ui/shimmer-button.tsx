'use client';

import { Button } from '@once-ui-system/core';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ShimmerButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  shimmerColor?: string;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, shimmerColor = '#F0B90A', style, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <Button
          ref={ref}
          {...props}
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            position: 'relative',
            overflow: 'hidden',
            ...style,
          }}
        >
          <motion.div
            className="shimmer"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent 0%, ${shimmerColor}40 50%, transparent 100%)`,
              transform: 'skewX(-20deg)',
            }}
          />
          <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
        </Button>
      </motion.div>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';