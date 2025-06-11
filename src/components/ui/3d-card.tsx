'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ThreeDCard({ children, className = '' }: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useSpring(useMotionValue(0));
  const rotateY = useSpring(useMotionValue(0));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    rotateX.set(-yPct * 20);
    rotateY.set(xPct * 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div
        style={{
          transform: 'translateZ(75px)',
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {children}
      </div>
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#F0B90A]/20 via-[#E91E8C]/20 to-[#9B59B6]/20 rounded-xl blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            transform: 'translateZ(-50px)',
          }}
        />
      )}
    </motion.div>
  );
}