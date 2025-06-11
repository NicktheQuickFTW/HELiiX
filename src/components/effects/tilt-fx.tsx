"use client";

import React, { ReactNode, useState } from 'react';

interface TiltFxProps {
  children: ReactNode;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  transitionSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TiltFx = ({
  children,
  maxTilt = 10,
  scale = 1.05,
  perspective = 1000,
  transitionSpeed = 400,
  className = '',
  style = {},
}: TiltFxProps) => {
  const [tiltStyle, setTiltStyle] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on mouse position
    const tiltX = ((y - centerY) / centerY) * maxTilt;
    const tiltY = -((x - centerX) / centerX) * maxTilt;
    
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
      transition: `transform ${transitionSpeed}ms ease-out`,
    });
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: `transform ${transitionSpeed}ms ease-out`,
    });
  };

  return (
    <div 
      className={`tilt-fx ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...style,
        ...tiltStyle,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export const Big12TiltFx = (props: TiltFxProps) => {
  return (
    <TiltFx 
      {...props} 
      className={`big12-tilt ${props.className || ''}`}
      maxTilt={15}
      scale={1.08}
    />
  );
};

export const ChampionshipTiltFx = (props: TiltFxProps) => {
  return (
    <TiltFx 
      {...props} 
      className={`championship-tilt ${props.className || ''}`}
      maxTilt={20}
      scale={1.1}
      perspective={1200}
    />
  );
};

export const TeamTiltFx = (props: TiltFxProps) => {
  return (
    <TiltFx 
      {...props} 
      className={`team-tilt ${props.className || ''}`}
      maxTilt={12}
      scale={1.06}
    />
  );
};
