"use client";

import React, { forwardRef } from 'react';
import { Badge } from "@once-ui-system/core";

type SafeBadgeProps = {
  children: React.ReactNode;
  variant?: string;
  background?: string;
  color?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onClick'>;

/**
 * SafeBadge - A wrapper around the Once UI Badge component that safely handles
 * DOM property errors and correctly transforms props to style objects.
 */
export const SafeBadge = forwardRef<HTMLDivElement, SafeBadgeProps>((
  {
    children,
    variant,
    background,
    color,
    border,
    className = "",
    style = {},
    onClick,
    ...rest
  }, ref) => {
  
  // Combine styles, moving DOM props to style object
  const combinedStyle = { 
    ...style,
    ...(background ? { background } : {}),
    ...(color ? { color } : {}),
    ...(border ? { border } : {})
  };

  // Safe approach: use any type to bypass TypeScript checking against Once UI's specific types
  const safeProps: any = {
    ref,
    className,
    style: combinedStyle,
    ...rest
  };

  // Only add props we're sure Badge accepts
  if (onClick) safeProps.onClick = onClick;
  if (variant !== undefined) safeProps.variant = variant;
  
  return <Badge {...safeProps}>{children}</Badge>;
});

SafeBadge.displayName = 'SafeBadge';