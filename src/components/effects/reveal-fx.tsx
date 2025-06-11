"use client";

import React, { ReactNode, useState, useEffect } from 'react';

interface RevealFxProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

export const RevealFx = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 20,
  once = true,
  className = '',
}: RevealFxProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Map direction to transform property
  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`;
        case 'down': return `translateY(-${distance}px)`;
        case 'left': return `translateX(${distance}px)`;
        case 'right': return `translateX(-${distance}px)`;
        default: return `translateY(${distance}px)`;
      }
    }
    return 'translate(0, 0)';
  };

  return (
    <div
      className={`reveal-fx ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
};

export const StaggeredReveal = ({ 
  children, 
  staggerDelay = 100,
  ...props 
}: RevealFxProps & { staggerDelay?: number }) => {
  return React.Children.map(children, (child, index) => (
    <RevealFx {...props} delay={props.delay || 0 + (index * staggerDelay)}>
      {child}
    </RevealFx>
  ));
};

export const ChampionshipReveal = (props: RevealFxProps) => {
  return (
    <RevealFx 
      {...props}
      className={`championship-reveal ${props.className || ''}`}
      duration={800}
      distance={30}
    >
      {props.children}
    </RevealFx>
  );
};

export const SportsReveal = (props: RevealFxProps) => {
  return (
    <RevealFx
      {...props}
      className={`sports-reveal ${props.className || ''}`}
      duration={700}
      distance={25}
    >
      {props.children}
    </RevealFx>
  );
};
