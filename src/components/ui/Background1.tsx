'use client';

import React from 'react';
import { Background } from '@once-ui-system/core';

export const Background1 = () => {
  return (
    <>
      <Background
        position="absolute"
        gradient={{
          display: true,
          x: 0,
          y: 60,
          width: 100,
          height: 75,
          tilt: 45,
          opacity: 90,
          colorStart: 'brand-background-strong',
          colorEnd: 'page-background',
        }}
        grid={{
          display: true,
          opacity: 100,
          width: '0.25rem',
          color: 'page-background',
          height: '0.25rem',
        }}
      />
    </>
  );
};
