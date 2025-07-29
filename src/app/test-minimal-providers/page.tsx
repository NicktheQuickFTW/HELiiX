'use client';

import { Column, Text, Button } from '@once-ui-system/core';

export default function TestMinimalPage() {
  return (
    <Column fillWidth minHeight="100vh" align="center" justify="center" gap="m">
      <Text variant="heading-strong-l">Minimal Once UI Test</Text>
      <Text>Testing with minimal providers</Text>
      <Button onClick={() => alert('Button clicked!')}>Test Button</Button>
    </Column>
  );
}
