"use client";

import React from 'react';
import { Row } from "@once-ui-system/core";

interface SafeRowProps {
  children: React.ReactNode;
  gap?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingX?: string;
  paddingY?: string;
  justifyContent?: string;
  alignItems?: string;
  wrap?: boolean;
  fillWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any; // For any other props
}

/**
 * SafeRow - A wrapper around the Once UI Row component that safely handles
 * DOM property errors from invalid flex props.
 */
export function SafeRow({
  children,
  gap,
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingX,
  paddingY,
  justifyContent,
  alignItems,
  wrap,
  fillWidth,
  className = "",
  style = {},
  ...rest
}: SafeRowProps) {
  // Map justifyContent values to Once UI's expected format
  const justifyMap: {[key: string]: string} = {
    'center': 'center',
    'flex-start': 'start',
    'flex-end': 'end',
    'space-between': 'between',
    'space-around': 'around',
    'space-evenly': 'evenly'
  };
  
  // Map alignItems values to Once UI's expected format
  const alignMap: {[key: string]: string} = {
    'center': 'center',
    'flex-start': 'start',
    'flex-end': 'end',
    'baseline': 'baseline',
    'stretch': 'stretch'
  };

  // Convert to Once UI props if possible
  const justify = justifyContent ? justifyMap[justifyContent] || undefined : undefined;
  const align = alignItems ? alignMap[alignItems] || undefined : undefined;
  
  // Create inline style for unmapped props
  const combinedStyle = {
    ...style,
    ...(justifyContent && !justify ? { justifyContent } : {}),
    ...(alignItems && !align ? { alignItems } : {})
  };

  return (
    <Row 
      gap={gap}
      padding={padding}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingX={paddingX}
      paddingY={paddingY}
      justify={justify}
      align={align}
      wrap={wrap}
      fillWidth={fillWidth}
      className={className}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </Row>
  );
}
