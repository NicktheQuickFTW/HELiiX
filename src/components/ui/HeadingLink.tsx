'use client';

import React from 'react';
import { Heading, Row, IconButton, useToast } from '@once-ui-system/core';

interface HeadingLinkProps {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const HeadingLink: React.FC<HeadingLinkProps> = ({
  id,
  level,
  children,
  style,
  className,
}) => {
  const { addToast } = useToast();

  const copyURL = (id: string): void => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(
      () => {
        addToast({
          variant: 'success',
          message: 'Link copied to clipboard.',
        });
      },
      () => {
        addToast({
          variant: 'danger',
          message: 'Failed to copy link.',
        });
      }
    );
  };

  const variantMap = {
    1: 'display-strong-xs',
    2: 'heading-strong-xl',
    3: 'heading-strong-l',
    4: 'heading-strong-m',
    5: 'heading-strong-s',
    6: 'heading-strong-xs',
  } as const;

  const variant = variantMap[level];
  const asTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Row
      style={{
        ...style,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover .copy-icon': {
          opacity: 1,
        },
      }}
      onClick={() => copyURL(id)}
      className={className}
      vertical="center"
      gap="4"
    >
      <Heading id={id} variant={variant} as={asTag}>
        {children}
      </Heading>
      <IconButton
        className="copy-icon"
        size="s"
        icon="openLink"
        variant="ghost"
        tooltip="Copy link"
        tooltipPosition="right"
        style={{
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
      />
    </Row>
  );
};
