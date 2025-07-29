'use client';

import { useEffect } from 'react';
import { Column, Button, Heading, Text } from '@once-ui-system/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-m)',
          alignItems: 'center',
        }}
      >
        <Heading variant="display-strong-l">Error</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          An error occurred while loading this page.
        </Text>
        <Button variant="primary" size="m" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
