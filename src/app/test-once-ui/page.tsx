'use client';

import { Column, Text } from '@once-ui-system/core';

export default function TestOnceUIPage() {
  // Test with minimal Once UI components
  try {
    return (
      <Column
        fillWidth
        minHeight="100vh"
        style={{ backgroundColor: 'var(--page-background, #000)' }}
      >
        <Text variant="heading-strong-l">Once UI Test Page</Text>
        <Text>If you can see this, Once UI is working!</Text>
      </Column>
    );
  } catch (error) {
    console.error('Once UI Error:', error);
    return (
      <div
        style={{
          padding: '20px',
          color: 'white',
          backgroundColor: '#1a1a1a',
          minHeight: '100vh',
        }}
      >
        <h1>Once UI Error</h1>
        <p>Error loading Once UI components</p>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}
