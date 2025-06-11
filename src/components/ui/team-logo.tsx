"use client";

import React from 'react';
import Image from 'next/image';

interface TeamLogoProps {
  team: string;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  variant?: 'primary' | 'secondary' | 'monochrome';
  className?: string;
  style?: React.CSSProperties;
}

export const TeamLogo = ({
  team,
  size = 'm',
  variant = 'primary',
  className = '',
  style = {},
}: TeamLogoProps) => {
  // Size mapping in pixels
  const sizeMap = {
    xs: 24,
    s: 32,
    m: 48,
    l: 64,
    xl: 96,
  };
  
  const pixelSize = sizeMap[size];
  
  // Path to team logos
  const getLogoPath = () => {
    // Default path to the team logo
    const basePath = `/assets/logos/teams`;
    
    // Construct the file name based on team name and variant
    let fileName = team.toLowerCase().replace(/\s+/g, '_');
    
    if (variant === 'secondary') {
      fileName = `${fileName}_alt`;
    } else if (variant === 'monochrome') {
      fileName = `${fileName}_mono`;
    }
    
    return `${basePath}/${fileName}.svg`;
  };

  return (
    <div 
      className={`team-logo ${className}`}
      style={{
        display: 'inline-block',
        ...style,
      }}
    >
      <Image
        src={getLogoPath()}
        alt={`${team} logo`}
        width={pixelSize}
        height={pixelSize}
        style={{ width: pixelSize, height: pixelSize }}
      />
    </div>
  );
};
