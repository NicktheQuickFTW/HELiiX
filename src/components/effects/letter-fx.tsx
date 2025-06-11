"use client";

import React, { ReactNode, useState, useEffect } from 'react';

interface LetterFxProps {
  text: string;
  delay?: number; // delay in ms
  speed?: number; // speed in ms
  className?: string;
  style?: React.CSSProperties;
}

export const LetterFx = ({ 
  text, 
  delay = 0, 
  speed = 50,
  className = '',
  style = {}
}: LetterFxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let timer: NodeJS.Timeout;

    // Initial delay
    const initialDelay = setTimeout(() => {
      // Start typing effect
      timer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
          setIsComplete(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(timer);
    };
  }, [text, delay, speed]);

  return (
    <span className={`letter-fx ${isComplete ? 'complete' : ''} ${className}`} style={style}>
      {displayedText}
    </span>
  );
};

export const Big12LetterFx = (props: LetterFxProps) => {
  return (
    <LetterFx 
      {...props} 
      className={`big12-letter-fx ${props.className || ''}`}
      style={{
        fontWeight: 'bold',
        color: 'var(--brand-on-background-strong)',
        ...props.style
      }}
    />
  );
};

export const ChampionshipLetterFx = (props: LetterFxProps) => {
  return (
    <LetterFx 
      {...props} 
      className={`championship-letter-fx ${props.className || ''}`}
      style={{
        fontWeight: 'bold',
        fontSize: '1.25em',
        textTransform: 'uppercase',
        color: 'var(--accent-on-background-strong)',
        ...props.style
      }}
    />
  );
};
