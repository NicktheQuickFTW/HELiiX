'use client';

import React from 'react';
import { Background } from '@once-ui-system/core';

export const Background4 = () => {
  return (
    <>
      <Background
        position="absolute"
        mask={{
          x: 50,
          y: 50,
          radius: 50,
        }}
        grid={{
          display: true,
          color: 'neutral-alpha-medium',
          width: '1.5rem',
          height: '1.5rem',
        }}
      />
      <Background
        position="absolute"
        mask={{
          cursor: true,
          radius: 50,
        }}
        dots={{
          display: true,
          color: 'neutral-alpha-medium',
          size: '12',
        }}
      />
    </>
  );
};
