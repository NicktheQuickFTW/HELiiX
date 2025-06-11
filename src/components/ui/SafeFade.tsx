"use client";

import React, { forwardRef } from 'react';
import { Fade } from "@once-ui-system/core";

type SafeFadeProps = {
  children: React.ReactNode;
  trigger?: 'inView' | 'immediate';
  delay?: number;
  duration?: number;
  translateY?: number | string;
  className?: string;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>;

/**
 * SafeFade - A wrapper around the Once UI Fade component that safely handles
 * DOM property errors from props like translateY.
 */
export const SafeFade = forwardRef<HTMLDivElement, SafeFadeProps>((
  {
    children,
    trigger = 'inView',
    delay = 0,
    translateY,
    duration,
    className = '',
    style = {},
    ...rest
  }, ref) => {
  // Extract translateY and apply it as CSS custom property
  let translatedStyle = { ...style };
  
  if (translateY !== undefined) {
    const yValue = typeof translateY === 'number' ? `${translateY}px` : translateY;
    translatedStyle = {
      ...translatedStyle,
      transform: `translateY(${yValue})` 
    };
  }

  // Safe approach: don't pass translateY directly to Fade
  // Use any to bypass type checking against the Once UI components
  const safeProps: any = {
    ref,
    className,
    style: translatedStyle,
    ...rest
  };

  // Only add props we're sure are accepted by Fade
  if (trigger) safeProps.trigger = trigger;
  if (delay !== undefined) safeProps.delay = delay;
  if (duration !== undefined) safeProps.duration = duration;

  return <Fade {...safeProps}>{children}</Fade>;
});

SafeFade.displayName = 'SafeFade';

