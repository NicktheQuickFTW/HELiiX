'use client';

import { motion } from 'framer-motion';

interface BorderBeamEffectProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeamEffect({
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = '#F0B90A',
  colorTo = '#9B59B6',
  delay = 0,
}: BorderBeamEffectProps) {
  return (
    <>
      <motion.div
        style={{
          position: 'absolute',
          inset: -borderWidth,
          borderRadius: 'inherit',
          padding: borderWidth,
          background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          delay,
        }}
      />
      
      {/* Glow effect */}
      <div
        style={{
          position: 'absolute',
          inset: -20,
          borderRadius: 'inherit',
          background: `conic-gradient(from 0deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
          filter: 'blur(20px)',
          opacity: 0.5,
          animation: `spin ${duration}s linear infinite`,
        }}
      />
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}