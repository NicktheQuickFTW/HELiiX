'use client';

import { Column, Heading, Text, Card, Button } from '@once-ui-system/core';

export default function TestLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
      }}
    >
      <Column gap="xl" maxWidth="m" style={{ margin: '0 auto' }}>
        <Card padding="xl">
          <Column gap="l">
            <Heading variant="display-strong-l">Layout Test</Heading>
            <Text variant="body-default-l">
              This page tests if the layout fills the viewport correctly.
            </Text>
            <Button onClick={() => (window.location.href = '/')}>
              Back to Home
            </Button>
          </Column>
        </Card>
      </Column>
    </div>
  );
}
