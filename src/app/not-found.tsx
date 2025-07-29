import Link from 'next/link';
import { Column, Row, Button, Heading, Text } from '@once-ui-system/core';

export default function NotFound() {
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
        <Heading variant="display-strong-l">404</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          The page you are looking for doesn't exist.
        </Text>
        <Link href="/">
          <Button variant="primary" size="m">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
