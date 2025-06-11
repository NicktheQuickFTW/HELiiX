"use client";

import React, { forwardRef } from 'react';
import { Card } from "@once-ui-system/core";

type SafeCardProps = {
  children: React.ReactNode;
  padding?: string;
  border?: string;
  background?: string;
  width?: string | number;
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onClick'>;

/**
 * SafeCard - A wrapper around the Once UI Card component that safely handles
 * DOM property errors like hover and correctly transforms props.
 */
export const SafeCard = forwardRef<HTMLDivElement, SafeCardProps>((
  {
    children,
    padding,
    border,
    background,
    width,
    hover,
    className = "",
    style = {},
    onClick,
    ...rest
  }, ref) => {
  // Handle hover prop by adding it to className
  const hoverClass = hover ? "card-hover-effect" : "";
  const combinedClassName = `${className} ${hoverClass}`.trim();
  
  // Combine styles
  const combinedStyle = { 
    ...style,
    // Add transition if hover is enabled
    ...(hover ? { transition: "box-shadow 0.3s ease, transform 0.2s ease" } : {})
  };

  // Safe approach: use any type to bypass TypeScript checking against Once UI's specific types
  const safeProps: any = {
    ref,
    className: combinedClassName,
    style: combinedStyle,
    ...rest
  };

  // Only add props we're sure Card accepts
  if (onClick) safeProps.onClick = onClick;
  if (padding !== undefined) safeProps.padding = padding;
  if (border !== undefined) safeProps.border = border;
  if (background !== undefined) safeProps.background = background;
  if (width !== undefined) safeProps.width = width;
  
  return <Card {...safeProps}>{children}</Card>;
});

SafeCard.displayName = 'SafeCard';

